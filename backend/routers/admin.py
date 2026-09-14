from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_admin

# Every route in this router requires a valid admin JWT.
router = APIRouter(dependencies=[Depends(get_current_admin)])


def _get_or_404(db: Session, model, item_id: int):
    obj = db.get(model, item_id)
    if not obj:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj


# ---------------- Services ----------------
@router.get("/services", response_model=List[schemas.ServiceOut])
def admin_list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).order_by(models.Service.sort_order).all()


@router.post("/services", response_model=schemas.ServiceOut)
def create_service(payload: schemas.ServiceCreate, db: Session = Depends(get_db)):
    obj = models.Service(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/services/{item_id}", response_model=schemas.ServiceOut)
def update_service(item_id: int, payload: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Service, item_id)
    for key, value in payload.model_dump().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/services/{item_id}")
def delete_service(item_id: int, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Service, item_id)
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}


# ---------------- Projects / Work ----------------
@router.get("/projects", response_model=List[schemas.ProjectOut])
def admin_list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.sort_order).all()


@router.post("/projects", response_model=schemas.ProjectOut)
def create_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db)):
    obj = models.Project(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/projects/{item_id}", response_model=schemas.ProjectOut)
def update_project(item_id: int, payload: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Project, item_id)
    for key, value in payload.model_dump().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/projects/{item_id}")
def delete_project(item_id: int, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Project, item_id)
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}


# ---------------- Testimonials ----------------
@router.get("/testimonials", response_model=List[schemas.TestimonialOut])
def admin_list_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).order_by(models.Testimonial.sort_order).all()


@router.post("/testimonials", response_model=schemas.TestimonialOut)
def create_testimonial(payload: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    obj = models.Testimonial(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/testimonials/{item_id}", response_model=schemas.TestimonialOut)
def update_testimonial(item_id: int, payload: schemas.TestimonialUpdate, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Testimonial, item_id)
    for key, value in payload.model_dump().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/testimonials/{item_id}")
def delete_testimonial(item_id: int, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.Testimonial, item_id)
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}


# ---------------- Contact submissions (read + delete only) ----------------
@router.get("/contacts", response_model=List[schemas.ContactOut])
def list_contacts(db: Session = Depends(get_db)):
    return (
        db.query(models.ContactSubmission)
        .order_by(models.ContactSubmission.created_at.desc())
        .all()
    )


@router.delete("/contacts/{item_id}")
def delete_contact(item_id: int, db: Session = Depends(get_db)):
    obj = _get_or_404(db, models.ContactSubmission, item_id)
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
