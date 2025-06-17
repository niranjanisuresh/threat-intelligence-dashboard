from fastapi import FastAPI
from app.api import cve_routes  # make sure this path is correct

app = FastAPI()
app.include_router(cve_routes.router)

@app.get("/")
def root():
    return {"message": "Your FastAPI CVE App is live!"}
