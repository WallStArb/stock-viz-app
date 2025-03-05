# Start script for FinViz Stock Screener Python backend
Write-Host "Starting FinViz Stock Screener backend server..." -ForegroundColor Green

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Run the Flask server
Write-Host "Starting Flask server..." -ForegroundColor Yellow
python run.py

# If the server exits, keep the window open
Write-Host "Server stopped. Press any key to exit..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 