@echo off
echo Starting AI Todo Chatbot...
echo.

echo Setting up environment...
set PYTHONPATH=%PYTHONPATH%;.

echo Starting backend server on port 8000...
echo Please keep this window open while using the chatbot
echo Visit http://localhost:3000/chat in your browser after starting the frontend
echo.

cd /d "C:\Users\HP\Desktop\hackathon-2-todo-app\phase-2\backend"
python -m uvicorn src.main:app --reload --port 8000 --host 0.0.0.0

pause