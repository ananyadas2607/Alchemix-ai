import os
import pathlib

def create_folder_structure(base_path: str):
    # Define the structure as a dictionary
    structure = {
        "alembic": {
            "versions": {}
        },
        "app": {
            "__init__.py": "",
            "api": {
                "__init__.py": "",
                "v1": {
                    "__init__.py": "",
                    "endpoints": {},
                    "routes.py": ""
                }
            },
            "core": {
                "__init__.py": "",
                "config.py": "",
                "security.py": ""
            },
            "db": {
                "__init__.py": "",
                "base.py": "",
                "session.py": ""
            },
            "models": {
                "__init__.py": "",
                "user.py": ""
            },
            "schemas": {
                "__init__.py": "",
                "user.py": ""
            },
            "services": {
                "__init__.py": "",
                "user_service.py": ""
            }
        },
        "tests": {
            "__init__.py": "",
            "conftest.py": "",
            "test_api": {}
        },
        ".env": "",
        ".gitignore": "",
        "alembic.ini": "",
        "main.py": "",
        "poetry.lock": "",
        "pyproject.toml": "",
        "README.md": ""
    }

    def create_structure(current_path: pathlib.Path, structure_dict: dict):
        for name, contents in structure_dict.items():
            path = current_path / name
            if isinstance(contents, dict):
                # If it's a dictionary, it's a directory
                path.mkdir(exist_ok=True)
                create_structure(path, contents)
            else:
                # If it's not a dictionary, it's a file
                path.touch()

    # Create base directory
    base_path = pathlib.Path(base_path)
    base_path.mkdir(exist_ok=True)
    
    # Create the structure
    create_structure(base_path, structure)
    
    print(f"Project structure created at {base_path}")

# Usage
if __name__ == "__main__":
    create_folder_structure("my_backend")