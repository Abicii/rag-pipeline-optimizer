from pathlib import Path

def load_text(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"{file_path} not found")

    return path.read_text(encoding="utf-8")
