# clientBackend

The Django backend for `clientFrontend`. It owns the public client API boundary and forwards broker data and review submissions to `brokerBackend`.

## Run

Start `brokerBackend` on port `8000`, then:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 127.0.0.1:8001
```

The client frontend proxies `/api` to this service. Configure `BROKER_BACKEND_URL` in `.env` when the core server is elsewhere.
