"""Auth repository implementation."""

from sqlmodel import Session, select

from app.domains.auth.models import Session as SessionModel
from app.domains.auth.models import User
from app.domains.auth.service import AuthRepository


class SqlAuthRepository(AuthRepository):
    """SQLModel-backed auth repository."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def find_user_by_email(self, email: str) -> User | None:
        return self._session.exec(select(User).where(User.email == email)).first()

    def add_user(self, user: User) -> None:
        self._session.add(user)

    def flush(self) -> None:
        self._session.flush()

    def add_session(self, session_model: SessionModel) -> None:
        self._session.add(session_model)

    def find_session_by_token_hash(self, token_hash: str) -> SessionModel | None:
        return self._session.exec(
            select(SessionModel).where(SessionModel.token_hash == token_hash)
        ).first()

    def find_user_by_id(self, user_id) -> User | None:
        return self._session.exec(select(User).where(User.id == user_id)).first()
