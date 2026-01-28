"""Auth domain service layer."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from app.domains.auth import errors
from app.domains.auth.models import Session as SessionModel
from app.domains.auth.models import User


class AuthRepository:
    """Persistence boundary for auth operations."""

    def find_user_by_email(self, email: str) -> User | None:  # pragma: no cover - interface
        raise NotImplementedError

    def add_user(self, user: User) -> None:  # pragma: no cover - interface
        raise NotImplementedError

    def flush(self) -> None:  # pragma: no cover - interface
        raise NotImplementedError

    def add_session(self, session_model: SessionModel) -> None:  # pragma: no cover - interface
        raise NotImplementedError

    def find_session_by_token_hash(self, token_hash: str) -> SessionModel | None:  # pragma: no cover
        raise NotImplementedError

    def find_user_by_id(self, user_id) -> User | None:  # pragma: no cover - interface
        raise NotImplementedError

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


def register_user(repo: AuthRepository, email: str) -> tuple[User, SessionModel, str]:
    """Register a new user and create a session."""
    normalized_email = normalize_email(email)
    existing = repo.find_user_by_email(normalized_email)
    if existing:
        raise errors.UserAlreadyExists

    user = User(email=normalized_email, last_login_at=_utcnow())
    repo.add_user(user)
    repo.flush()

    session_model, token = _create_session(repo, user)
    return user, session_model, token


def login_user(repo: AuthRepository, email: str) -> tuple[User, SessionModel, str]:
    """Login an existing user and create a session."""
    normalized_email = normalize_email(email)
    user = repo.find_user_by_email(normalized_email)
    if not user:
        raise errors.UserNotFound
    if not user.is_active:
        raise errors.UserInactive

    user.last_login_at = _utcnow()
    repo.add_user(user)
    session_model, token = _create_session(repo, user)
    return user, session_model, token


def logout_session(repo: AuthRepository, token: str) -> None:
    """Revoke an existing session by token."""
    token_hash = hash_token(token)
    session_model = repo.find_session_by_token_hash(token_hash)
    if not session_model:
        raise errors.SessionNotFound
    if session_model.revoked_at is not None:
        raise errors.SessionRevoked
    if _as_utc(session_model.expires_at) <= _utcnow():
        raise errors.SessionExpired

    session_model.revoked_at = _utcnow()
    repo.add_session(session_model)


def get_user_for_session(repo: AuthRepository, token: str) -> User:
    """Fetch the user for a valid session token."""
    token_hash = hash_token(token)
    session_model = repo.find_session_by_token_hash(token_hash)
    if not session_model:
        raise errors.SessionNotFound
    if session_model.revoked_at is not None:
        raise errors.SessionRevoked
    if _as_utc(session_model.expires_at) <= _utcnow():
        raise errors.SessionExpired

    user = repo.find_user_by_id(session_model.user_id)
    if not user:
        raise errors.UserNotFound
    if not user.is_active:
        raise errors.UserInactive

    return user


def _create_session(repo: AuthRepository, user: User) -> tuple[SessionModel, str]:
    token = secrets.token_urlsafe(32)
    token_hash = hash_token(token)
    expires_at = _utcnow() + timedelta(days=SESSION_TTL_DAYS)
    session_model = SessionModel(user_id=user.id, token_hash=token_hash, expires_at=expires_at)
    repo.add_session(session_model)
    return session_model, token
