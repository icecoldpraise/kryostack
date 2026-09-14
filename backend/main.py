"""
Kryostack -- FastAPI backend.

Run with:
    uvicorn main:app --reload

This single process serves both:
  - the JSON API, under /api/*
  - the static frontend (public site + /admin dashboard), everything else

On first run it creates kryostack.db (SQLite) in this folder, seeds a
default admin account and starter content, and prints the admin login
to the console.
"""
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from database import Base, engine, SessionLocal
import models  # noqa: F401  (needed so Base knows about all tables)
import seed_data
from routers import public, auth_router, admin

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data.run(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Kryostack API", lifespan=lifespan)

# API routes are registered first so they take priority over the catch-all
# static file mount below.
app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(public.router, prefix="/api", tags=["public"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

# Serves frontend/index.html at "/", frontend/admin/login.html at
# "/admin/login.html", etc. Must be mounted last.
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
