import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db import db_healthcheck
from sqlalchemy import text
from db import engine

load_dotenv()

app = FastAPI(title="살집찾기 API", version="0.1.0")

# 프론트 로컬(5173)에서 호출 가능하도록 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/db-health")
def db_health():
    return {"db_ok": db_healthcheck()}

@app.get("/")
def read_root():
    return {"message": "살집찾기 백엔드 성공!"}

@app.get("/complexes")
def list_complexes(region: str | None = None, limit: int = 300):
    """
    오늘은 단지 마스터만 반환 (지도/필터는 내일 확장)
    """
    sql = """
    select id, name, region, lat, lng
    from apartment_complexes
    where (:region is null or region like '%' || :region || '%')
    order by id desc
    limit :limit;
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), {"region": region, "limit": limit}).mappings().all()
        return {"items": [dict(r) for r in rows]}
