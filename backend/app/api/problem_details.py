"""Problem details helpers (RFC 7807 style)."""

from fastapi import HTTPException


def problem(status_code: int, title: str, detail: str, type_: str) -> HTTPException:
    """Create a problem-details HTTP exception."""
    return HTTPException(
        status_code=status_code,
        detail={
            "type": type_,
            "title": title,
            "status": status_code,
            "detail": detail,
        },
    )
