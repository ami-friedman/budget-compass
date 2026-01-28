"""Auth API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class AuthEmailIn(BaseModel):
    """Auth request payload with an email address."""

    email: EmailStr


class UserSummary(BaseModel):
    """User summary returned by auth endpoints."""

    id: UUID
    email: EmailStr
    created_at: datetime
    last_login_at: datetime | None
    is_active: bool
