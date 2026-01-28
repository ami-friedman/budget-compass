"""Auth domain errors."""


class AuthError(Exception):
    """Base class for auth errors."""


class UserAlreadyExists(AuthError):
    """Raised when attempting to register an existing user."""


class UserNotFound(AuthError):
    """Raised when a user cannot be found."""


class UserInactive(AuthError):
    """Raised when a user is inactive."""


class SessionNotFound(AuthError):
    """Raised when a session cannot be found."""


class SessionRevoked(AuthError):
    """Raised when a session has been revoked."""


class SessionExpired(AuthError):
    """Raised when a session has expired."""
