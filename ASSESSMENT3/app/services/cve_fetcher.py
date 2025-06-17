import requests
from datetime import datetime
from app.database.db import SessionLocal
from app.database.models import CVE

def fetch_and_store_cves():
    url = "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100"
    response = requests.get(url)
    data = response.json()

    total_fetched = len(data.get("vulnerabilities", []))
    print(f"[INFO] Total vulnerabilities fetched: {total_fetched}")

    session = SessionLocal()
    added_count = 0

    for item in data.get("vulnerabilities", []):
        cve_info = item.get("cve")
        if cve_info:
            cve_id = cve_info.get("id")
            description = next(
                (desc["value"] for desc in cve_info.get("descriptions", []) if desc["lang"] == "en"), ""
            )
            last_modified = datetime.fromisoformat(cve_info.get("lastModified")[:-1]) if "lastModified" in cve_info else None

            existing = session.query(CVE).filter(CVE.cve_id == cve_id).first()
            if not existing:
                session.add(CVE(cve_id=cve_id, description=description, last_modified=last_modified))
                added_count += 1
                print(f"[INFO] Stored CVE: {cve_id} | Modified: {last_modified}")

    session.commit()
    session.close()
    print(f"[INFO] Database commit complete. Total new CVEs added: {added_count}")
