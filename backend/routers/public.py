from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter()


@router.get("/services", response_model=List[schemas.ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).order_by(models.Service.sort_order).all()


@router.get("/work", response_model=List[schemas.ProjectOut])
def list_work(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.sort_order).all()


@router.get("/testimonials", response_model=List[schemas.TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).order_by(models.Testimonial.sort_order).all()


@router.post("/contact", response_model=schemas.ContactOut)
def submit_contact(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    entry = models.ContactSubmission(
        name=payload.name, email=payload.email, message=payload.message
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
