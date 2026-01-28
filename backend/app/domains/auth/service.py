"""Auth domain service layer."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from sqlmodel import Session, select

from app.domains.auth import errors
from app.domains.auth.models import Session as SessionModel
from app.domains.auth.models import User

SESSION_TTL_DAYS = 7


def normalize_email(email: str) -> str:
    """Normalize an email address for storage."""
    return email.strip().lower()


def hash_token(token: str) -> str:
    """Hash session tokens for storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _as_utc(dt: datetime) -> datetime:
    """Normalize datetimes to UTC-aware for comparisons.

    MySQL returns naive datetimes by default; treat them as UTC.
    """
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def register_user(session: Session, email: str) -> tuple[User, SessionModel, str]:
    """Register a new user and create a session."""
    normalized_email = normalize_email(email)
    existing = session.exec(select(User).where(User.email == normalized_email)).first()
    if existing:
        raise errors.UserAlreadyExists

    user = User(email=normalized_email, last_login_at=_utcnow())
    session.add(user)
    session.flush()

    session_model, token = _create_session(session, user)
    return user, session_model, token


def login_user(session: Session, email: str) -> tuple[User, SessionModel, str]:
    """Login an existing user and create a session."""
    normalized_email = normalize_email(email)
    user = session.exec(select(User).where(User.email == normalized_email)).first()
    if not user:
        raise errors.UserNotFound
    if not user.is_active:
        raise errors.UserInactive

    user.last_login_at = _utcnow()
    session.add(user)
    session_model, token = _create_session(session, user)
    return user, session_model, token


def logout_session(session: Session, token: str) -> None:
    """Revoke an existing session by token."""
    token_hash = hash_token(token)
    session_model = session.exec(
        select(SessionModel).where(SessionModel.token_hash == token_hash)
    ).first()
    if not session_model:
        raise errors.SessionNotFound
    if session_model.revoked_at is not None:
        raise errors.SessionRevoked
    if _as_utc(session_model.expires_at) <= _utcnow():
        raise errors.SessionExpired

    session_model.revoked_at = _utcnow()
    session.add(session_model)


def get_user_for_session(session: Session, token: str) -> User:
    """Fetch the user for a valid session token."""
    token_hash = hash_token(token)
    session_model = session.exec(
        select(SessionModel).where(SessionModel.token_hash == token_hash)
    ).first()
    if not session_model:
        raise errors.SessionNotFound
    if session_model.revoked_at is not None:
        raise errors.SessionRevoked
    if _as_utc(session_model.expires_at) <= _utcnow():
        raise errors.SessionExpired

    user = session.exec(select(User).where(User.id == session_model.user_id)).first()
    if not user:
        raise errors.UserNotFound
    if not user.is_active:
        raise errors.UserInactive

    return user


def _create_session(session: Session, user: User) -> tuple[SessionModel, str]:
    token = secrets.token_urlsafe(32)
    token_hash = hash_token(token)
    expires_at = _utcnow() + timedelta(days=SESSION_TTL_DAYS)
    session_model = SessionModel(user_id=user.id, token_hash=token_hash, expires_at=expires_at)
    session.add(session_model)
    return session_model, token
