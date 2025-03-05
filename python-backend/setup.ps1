# Setup script for FinViz Stock Screener Python backend
Write-Host "Setting up Python backend for FinViz Stock Screener..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Found $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is not installed or not in PATH. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists, create if not
if (-not (Test-Path -Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Setup complete! You can now run the server with:" -ForegroundColor Green
Write-Host "python run.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or simply run: .\start_server.ps1" -ForegroundColor Cyan 