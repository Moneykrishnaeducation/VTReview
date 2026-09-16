import os
import subprocess
import sys
from pathlib import Path


CHILD_SERVICES = (
    ("clientBackend", "8001"),
    ("authorBackend", "8002"),
)


def start_child_services() -> list[subprocess.Popen[bytes]]:
    workspace_root = Path(__file__).resolve().parent.parent
    processes = []
    child_environment = os.environ.copy()
    child_environment["VTREVIEW_CHILD_SERVICE"] = "1"

    for service_name, port in CHILD_SERVICES:
        service_dir = workspace_root / service_name
        command = [
            sys.executable,
            "manage.py",
            "runserver",
            f"127.0.0.1:{port}",
            "--noreload",
        ]
        processes.append(
            subprocess.Popen(command, cwd=service_dir, env=child_environment)
        )

    return processes


def stop_child_services(processes: list[subprocess.Popen[bytes]]) -> None:
    for process in processes:
        if process.poll() is None:
            process.terminate()
    for process in processes:
        process.wait()


def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line

    child_processes = []
    should_start_children = (
        len(sys.argv) > 1
        and sys.argv[1] == "runserver"
        and os.getenv("VTREVIEW_CHILD_SERVICE") != "1"
    )

    try:
        if should_start_children:
            child_processes = start_child_services()
            if "--noreload" not in sys.argv:
                sys.argv.append("--noreload")
        execute_from_command_line(sys.argv)
    finally:
        if child_processes:
            stop_child_services(child_processes)


if __name__ == "__main__":
    main()
