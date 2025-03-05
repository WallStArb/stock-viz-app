# Script to run the Python backend for the stock screener

# Navigate to the Python backend directory
Set-Location -Path "python-backend"

# Check if virtual environment exists
if (-not (Test-Path -Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate the virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run the Flask server
Write-Host "Starting Flask server..." -ForegroundColor Green
python run.py

# Keep the window open if the server exits
Write-Host "Server stopped. Press any key to exit..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 