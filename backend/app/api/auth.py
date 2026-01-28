"""Auth API routes."""

from __future__ import annotations

from datetime import timezone

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlmodel import Session

from app.api.problem_details import problem
from app.core.config import get_settings
from app.db.session import get_session
from app.domains.auth import errors, service
from app.domains.auth.repository import SqlAuthRepository
from app.domains.auth.models import User
from app.domains.auth.schemas import AuthEmailIn, UserSummary

auth_router = APIRouter(prefix="/auth", tags=["auth"])

SESSION_COOKIE_NAME = "bc_session"


def _set_session_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.environment == "prod",
        max_age=service.SESSION_TTL_DAYS * 24 * 60 * 60,
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=SESSION_COOKIE_NAME)


def _user_summary(user: User) -> UserSummary:
    return UserSummary(
        id=user.id,
        email=user.email,
        created_at=user.created_at.astimezone(timezone.utc),
        last_login_at=user.last_login_at.astimezone(timezone.utc)
        if user.last_login_at
        else None,
        is_active=user.is_active,
    )


@auth_router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserSummary)
def register(payload: AuthEmailIn, response: Response, db: Session = Depends(get_session)) -> UserSummary:
    try:
        repo = SqlAuthRepository(db)
        user, _session, token = service.register_user(repo, payload.email)
        db.commit()
    except errors.UserAlreadyExists as exc:
        raise problem(
            status_code=status.HTTP_409_CONFLICT,
            title="User already exists",
            detail="A user with this email already exists.",
            type_="https://budget-compass/errors/user-already-exists",
        ) from exc

    _set_session_cookie(response, token)
    return _user_summary(user)


@auth_router.post("/login", response_model=UserSummary)
def login(payload: AuthEmailIn, response: Response, db: Session = Depends(get_session)) -> UserSummary:
    try:
        repo = SqlAuthRepository(db)
        user, _session, token = service.login_user(repo, payload.email)
        db.commit()
    except errors.UserNotFound as exc:
        raise problem(
            status_code=status.HTTP_404_NOT_FOUND,
            title="User not found",
            detail="No user with this email was found.",
            type_="https://budget-compass/errors/user-not-found",
        ) from exc
    except errors.UserInactive as exc:
        raise problem(
            status_code=status.HTTP_403_FORBIDDEN,
            title="User inactive",
            detail="This user is inactive.",
            type_="https://budget-compass/errors/user-inactive",
        ) from exc

    _set_session_cookie(response, token)
    return _user_summary(user)


@auth_router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: Session = Depends(get_session),
    token: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
) -> None:
    if token:
        try:
            repo = SqlAuthRepository(db)
            service.logout_session(repo, token)
            db.commit()
        except errors.AuthError:
            pass

    _clear_session_cookie(response)


@auth_router.get("/me", response_model=UserSummary)
def me(
    db: Session = Depends(get_session),
    token: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
) -> UserSummary:
    if not token:
        raise problem(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Not authenticated",
            detail="Missing session.",
            type_="https://budget-compass/errors/not-authenticated",
        )

    try:
        repo = SqlAuthRepository(db)
        user = service.get_user_for_session(repo, token)
    except errors.SessionNotFound as exc:
        raise problem(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Invalid session",
            detail="Session is not valid.",
            type_="https://budget-compass/errors/invalid-session",
        ) from exc
    except errors.SessionExpired as exc:
        raise problem(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Session expired",
            detail="Session has expired.",
            type_="https://budget-compass/errors/session-expired",
        ) from exc
    except errors.SessionRevoked as exc:
        raise problem(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Session revoked",
            detail="Session has been revoked.",
            type_="https://budget-compass/errors/session-revoked",
        ) from exc
    except errors.UserInactive as exc:
        raise problem(
            status_code=status.HTTP_403_FORBIDDEN,
            title="User inactive",
            detail="User is inactive.",
            type_="https://budget-compass/errors/user-inactive",
        ) from exc

    return _user_summary(user)
