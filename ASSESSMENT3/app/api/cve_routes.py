from fastapi import APIRouter
from datetime import datetime, timedelta
from app.database.db import SessionLocal
from app.database.models import CVE
from app.services.cve_fetcher import fetch_and_store_cves

router = APIRouter()
@router.get("/fetch")
def fetch_data():
    fetch_and_store_cves()
    return {"message": "CVE data fetched and stored"}
@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.get("/cve/modified")
def get_recent_cves(days: int = 7):
    session = SessionLocal()
    cutoff = datetime.now() - timedelta(days=days)
    recent = session.query(CVE).filter(CVE.last_modified >= cutoff).all()
    session.close()
    return [{"cve_id": c.cve_id, "last_modified": c.last_modified} for c in recent]
