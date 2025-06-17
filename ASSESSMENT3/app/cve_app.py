import requests
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

# --- Database Setup ---
DATABASE_URL = "sqlite:///./cves.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class CVE(Base):
    __tablename__ = "cves"
    id = Column(Integer, primary_key=True, index=True)
    cve_id = Column(String, unique=True, index=True)
    description = Column(Text)
    last_modified = Column(DateTime)

Base.metadata.create_all(bind=engine)

# --- CVE Fetcher ---
def fetch_and_store_cves():
    url = "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10"
    response = requests.get(url)
    data = response.json()

    session = SessionLocal()
    for item in data.get("vulnerabilities", []):
        cve_data = item.get("cve", {})
        cve_id = cve_data.get("id")
        desc = next((d["value"] for d in cve_data.get("descriptions", []) if d["lang"] == "en"), "")
        modified = datetime.fromisoformat(cve_data.get("lastModified")[:-1]) if "lastModified" in cve_data else None

        if not session.query(CVE).filter_by(cve_id=cve_id).first():
            session.add(CVE(cve_id=cve_id, description=desc, last_modified=modified))
    session.commit()
    session.close()

# --- API Service ---
app = FastAPI()

@app.get("/fetch")
def fetch_data():
    fetch_and_store_cves()
    return {"message": "CVE data fetched and stored successfully."}

@app.get("/cve/{cve_id}")
def get_cve_by_id(cve_id: str):
    session = SessionLocal()
    result = session.query(CVE).filter(CVE.cve_id == cve_id).first()
    session.close()
    return {
        "cve_id": result.cve_id,
        "description": result.description,
        "last_modified": result.last_modified
    } if result else {"error": "CVE not found"}

@app.get("/cve/modified")
def get_recent_cves(days: int = 30):
    session = SessionLocal()
    cutoff = datetime.now() - timedelta(days=days)
    recent = session.query(CVE).filter(CVE.last_modified >= cutoff).all()
    session.close()
    return [{"cve_id": c.cve_id, "last_modified": c.last_modified} for c in recent]
