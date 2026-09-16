# authorBackend

The Django backend for `authorFrontend`. It owns the authoring API boundary and forwards broker management and review moderation to `brokerBackend`.

## Run

Start `brokerBackend` on port `8000`, then:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 127.0.0.1:8002
```

The author frontend proxies `/api` to this service. Configure `BROKER_BACKEND_URL` in `.env` when the core server is elsewhere.
