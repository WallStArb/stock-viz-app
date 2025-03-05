@echo off
echo Starting FinViz Stock Screener backend server...

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Run the Flask server
echo Starting Flask server...
python run.py

REM If the server exits, keep the window open
pause 