import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Import your FastAPI app
from main import app

# Vercel handler
handler = app