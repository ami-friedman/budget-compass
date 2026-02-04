from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from app.domains.auth.models import Session
from app.domains.auth.models import User
from app.domains.auth.service import SESSION_TTL_DAYS
from app.domains.auth.service import get_user_for_session
from app.domains.auth.service import hash_token
from app.domains.auth.service import login_user
from app.domains.auth.service import logout_session
from app.domains.auth.service import normalize_email
from app.domains.auth.service import register_user


class InMemoryAuthRepository:
    def __init__(self) -> None:
        self._users_by_email: dict[str, User] = {}
        self._users_by_id: dict[str, User] = {}
        self._sessions_by_hash: dict[str, Session] = {}

    def find_user_by_email(self, email: str) -> User | None:
        return self._users_by_email.get(email)

    def add_user(self, user: User) -> None:
        self._users_by_email[user.email] = user
        self._users_by_id[str(user.id)] = user

    def flush(self) -> None:
        return None

    def add_session(self, session_model: Session) -> None:
        self._sessions_by_hash[session_model.token_hash] = session_model

    def find_session_by_token_hash(self, token_hash: str) -> Session | None:
        return self._sessions_by_hash.get(token_hash)

    def find_user_by_id(self, user_id) -> User | None:
        return self._users_by_id.get(str(user_id))


@pytest.fixture
def repo() -> InMemoryAuthRepository:
    return InMemoryAuthRepository()


@pytest.fixture
def fixed_now() -> datetime:
    return datetime(2024, 1, 15, 12, 0, 0, tzinfo=timezone.utc)


def test_normalize_email_strips_and_lowercases() -> None:
    assert normalize_email("  Example@Email.COM ") == "example@email.com"


def test_register_user_creates_session(repo: InMemoryAuthRepository, fixed_now: datetime, monkeypatch) -> None:
    monkeypatch.setattr("app.domains.auth.service._utcnow", lambda: fixed_now)
    monkeypatch.setattr("app.domains.auth.service.secrets.token_urlsafe", lambda _: "token")

    user, session_model, token = register_user(repo, "New@Example.com")

    assert token == "token"
    assert user.email == "new@example.com"
    assert user.last_login_at == fixed_now
    assert session_model.user_id == user.id
    assert session_model.token_hash == hash_token("token")
    assert session_model.expires_at == fixed_now + timedelta(days=SESSION_TTL_DAYS)
    assert repo.find_user_by_email("new@example.com") is user


def test_login_user_updates_last_login(repo: InMemoryAuthRepository, fixed_now: datetime, monkeypatch) -> None:
    user = User(email="member@example.com", last_login_at=fixed_now - timedelta(days=1))
    repo.add_user(user)
    monkeypatch.setattr("app.domains.auth.service._utcnow", lambda: fixed_now)
    monkeypatch.setattr("app.domains.auth.service.secrets.token_urlsafe", lambda _: "token")

    logged_in_user, session_model, token = login_user(repo, "member@example.com")

    assert token == "token"
    assert logged_in_user is user
    assert logged_in_user.last_login_at == fixed_now
    assert session_model.user_id == user.id
    assert repo.find_session_by_token_hash(session_model.token_hash) is session_model


def test_logout_session_sets_revoked_at(repo: InMemoryAuthRepository, fixed_now: datetime, monkeypatch) -> None:
    user = User(email="member@example.com")
    repo.add_user(user)
    session_model = Session(
        user_id=user.id,
        token_hash=hash_token("token"),
        expires_at=fixed_now + timedelta(days=1),
    )
    repo.add_session(session_model)
    monkeypatch.setattr("app.domains.auth.service._utcnow", lambda: fixed_now)

    logout_session(repo, "token")

    assert session_model.revoked_at == fixed_now


def test_get_user_for_session_returns_user(
    repo: InMemoryAuthRepository, fixed_now: datetime, monkeypatch
) -> None:
    user = User(email="member@example.com")
    repo.add_user(user)
    session_model = Session(
        user_id=user.id,
        token_hash=hash_token("token"),
        expires_at=fixed_now + timedelta(days=1),
    )
    repo.add_session(session_model)
    monkeypatch.setattr("app.domains.auth.service._utcnow", lambda: fixed_now)

    result = get_user_for_session(repo, "token")

    assert result is user
