"""
Seeds the database with a default admin account and the starter content
that shipped with the original static design. Runs once, automatically,
on app startup -- if a table already has rows, it's left alone.
"""
from sqlalchemy.orm import Session

import models
from auth import hash_password

DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "changeme123!"

DEFAULT_SERVICES = [
    dict(
        title="Web Development",
        icon_key="web",
        sort_order=1,
        description=(
            "Fast, accessible, and maintainable web applications — from "
            "marketing sites to complex internal platforms — built on modern "
            "frameworks with performance and SEO treated as requirements, "
            "not afterthoughts."
        ),
    ),
    dict(
        title="Mobile & App Solutions",
        icon_key="mobile",
        sort_order=2,
        description=(
            "Native and cross-platform apps for iOS and Android, designed "
            "around real usage patterns — offline support, push "
            "notifications, and app-store readiness handled end to end."
        ),
    ),
    dict(
        title="AI & Automation",
        icon_key="ai",
        sort_order=3,
        description=(
            "Custom AI features and workflow automation that remove manual "
            "bottlenecks — from intelligent chat and document processing to "
            "internal tools that quietly save your team hours every week."
        ),
    ),
    dict(
        title="Cybersecurity",
        icon_key="security",
        sort_order=4,
        description=(
            "Security audits, penetration testing, and hardened "
            "infrastructure baked into every build — so the systems you "
            "ship are resilient before launch, not patched after a breach."
        ),
    ),
]

DEFAULT_PROJECTS = [
    dict(
        name="Aurora Health",
        tag="Web · Security",
        sort_order=1,
        color1="#142033", color2="#1E3A5F", color3="#3B6EC9",
        description=(
            "A HIPAA-aligned patient portal rebuilt from a legacy system, "
            "cutting page load times by 70% and passing an independent "
            "security audit on first review."
        ),
    ),
    dict(
        name="Voltra Logistics",
        tag="Mobile",
        sort_order=2,
        color1="#0F1A2B", color2="#2A4A6E", color3="#8FD9FF",
        description=(
            "A driver-facing fleet app with offline-first routing and live "
            "dispatch sync, now running across 400+ vehicles nationwide."
        ),
    ),
    dict(
        name="Nimbus Ledger",
        tag="AI & Automation",
        sort_order=3,
        color1="#101826", color2="#274064", color3="#4A7FCB",
        description=(
            "An AI-assisted reconciliation pipeline that replaced a manual "
            "finance workflow, reducing monthly close time from 9 days to "
            "under 2."
        ),
    ),
    dict(
        name="Fjord Bank",
        tag="Cybersecurity",
        sort_order=4,
        color1="#0D141F", color2="#1B2D45", color3="#5AA9CC",
        description=(
            "A full infrastructure hardening engagement — penetration "
            "testing, access-control redesign, and zero-downtime "
            "remediation."
        ),
    ),
]

DEFAULT_TESTIMONIALS = [
    dict(
        name="Dana Whitfield",
        role="CTO, Aurora Health",
        initials="DW",
        sort_order=1,
        quote=(
            "Kryostack didn't just rebuild our portal — they rebuilt our "
            "confidence in it. The security review that used to terrify us "
            "before every release is now a formality."
        ),
    ),
    dict(
        name="Raj Mehta",
        role="Head of Operations, Voltra Logistics",
        initials="RM",
        sort_order=2,
        quote=(
            "They understood our logistics problem better than we did. The "
            "offline sync alone saved our dispatch team hours every single "
            "shift."
        ),
    ),
]


def run(db: Session) -> None:
    if db.query(models.AdminUser).count() == 0:
        admin = models.AdminUser(
            username=DEFAULT_ADMIN_USERNAME,
            password_hash=hash_password(DEFAULT_ADMIN_PASSWORD),
        )
        db.add(admin)
        print("=" * 64)
        print("Created a default admin account:")
        print(f"    username: {DEFAULT_ADMIN_USERNAME}")
        print(f"    password: {DEFAULT_ADMIN_PASSWORD}")
        print("Log in at /admin/login.html and change this password")
        print("right away (Settings tab in the dashboard).")
        print("=" * 64)

    if db.query(models.Service).count() == 0:
        db.add_all(models.Service(**s) for s in DEFAULT_SERVICES)

    if db.query(models.Project).count() == 0:
        db.add_all(models.Project(**p) for p in DEFAULT_PROJECTS)

    if db.query(models.Testimonial).count() == 0:
        db.add_all(models.Testimonial(**t) for t in DEFAULT_TESTIMONIALS)

    db.commit()
