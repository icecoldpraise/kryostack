from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


# ---------- Services ----------
class ServiceBase(BaseModel):
    title: str
    description: str
    icon_key: str = "generic"
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceOut(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Projects / Work ----------
class ProjectBase(BaseModel):
    name: str
    tag: str = ""
    description: str
    color1: str = "#142033"
    color2: str = "#1E3A5F"
    color3: str = "#3B6EC9"
    sort_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Testimonials ----------
class TestimonialBase(BaseModel):
    quote: str
    name: str
    role: str = ""
    initials: str = ""
    sort_order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(TestimonialBase):
    pass


class TestimonialOut(TestimonialBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Contact ----------
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------- Auth ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
