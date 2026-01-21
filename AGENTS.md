# Budget Compass

## Overview

Budget Compass is a personal budgeting application designed to give a clear, trustworthy view of where money is, what it is for, and how spending aligns with intent.  
The app separates **physical money (accounts)** from **budget intent (categories)** to avoid misleading reports and to support savings that carry over across months.

The budgeting model is built around three meta-categories:
- **Cash** — everyday discretionary spending
- **Monthly** — recurring or predictable monthly expenses
- **Savings** — Any expense that incurres less frequent than once a month, guideline usually is that it's less than 8 times a year

Savings are funded regularly and may also be spent from, with balances carrying over indefinitely. The system emphasizes correctness, transparency, and long-term maintainability over short-term convenience.

The app is intended for multiple users
---

## Tech Stack

### Backend
- **FastAPI** for API development
- **SQLModel** for data modeling
- **MySQL** as the primary database
- **Alembic** for migrations
- **Pytest** for automated testing
- **uv** for package management
- **Ruff** for linting 

### Frontend
- **Angular**
- **Tailwind CSS**
- **TypeScript**
- **OpenAPI-generated API client**
- **Component-driven, feature-based architecture**


---


