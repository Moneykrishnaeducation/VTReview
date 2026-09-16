# brokerBackend

The core Django/PostgreSQL server for VTReview. It owns the broker and review data; `clientBackend` and `authorBackend` expose frontend-specific Django APIs that proxy to this service.

## Setup

1. Install Python 3.12+ and PostgreSQL 16+, or start PostgreSQL with `docker compose up -d postgres`.
2. Create a virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and adjust credentials if needed.
4. Apply the schema and start all three backend services through the broker entry point:

```powershell
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The health check is available at `http://127.0.0.1:8000/api/v1/health/`.

The broker `manage.py runserver` command automatically starts `clientBackend` on
`http://127.0.0.1:8001` and `authorBackend` on `http://127.0.0.1:8002`. Stop the
broker process with `Ctrl+C` to stop all three services.

## API boundaries

- Client reads: `GET /api/v1/brokers/` and `GET /api/v1/brokers/<slug>/`
- Client review submission: `POST /api/v1/reviews/`
- Author broker management: `GET|POST /api/v1/author/brokers/`
- Author moderation queue: `GET /api/v1/author/reviews/`
- Author moderation action: `PATCH /api/v1/author/reviews/<id>/moderate/` with `{ "status": "approved" | "rejected" }`

Authentication and role permissions should be added before production deployment. The initial API is intentionally open for local integration.
