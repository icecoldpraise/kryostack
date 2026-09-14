from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    # one of: web, mobile, ai, security, generic -- maps to an icon in the frontend
    icon_key = Column(String(40), default="generic")
    sort_order = Column(Integer, default=0)


class Project(Base):
    """A featured work / portfolio item."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    tag = Column(String(80), default="")
    description = Column(Text, nullable=False)
    # thumbnail is rendered as a CSS gradient built from these three colors
    color1 = Column(String(20), default="#142033")
    color2 = Column(String(20), default="#1E3A5F")
    color3 = Column(String(20), default="#3B6EC9")
    sort_order = Column(Integer, default=0)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    quote = Column(Text, nullable=False)
    name = Column(String(120), nullable=False)
    role = Column(String(160), default="")
    initials = Column(String(4), default="")
    sort_order = Column(Integer, default=0)


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
