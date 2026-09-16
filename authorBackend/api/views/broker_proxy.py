import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def broker_proxy(request):
    target = f"{settings.BROKER_BACKEND_URL}{request.get_full_path()}"
    headers = {"Accept": "application/json"}
    if request.headers.get("Content-Type"):
        headers["Content-Type"] = request.headers["Content-Type"]
    if request.headers.get("Authorization"):
        headers["Authorization"] = request.headers["Authorization"]
    body = request.body if request.method in {"POST", "PUT", "PATCH"} else None

    try:
        upstream_request = Request(target, data=body, headers=headers, method=request.method)
        with urlopen(upstream_request, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return JsonResponse(payload, status=response.status, safe=not isinstance(payload, list))
    except HTTPError as error:
        try:
            payload = json.loads(error.read().decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            payload = {"message": error.reason}
        return JsonResponse(payload, status=error.code, safe=not isinstance(payload, list))
    except (URLError, TimeoutError):
        return JsonResponse({"message": "brokerBackend is unavailable."}, status=502)
