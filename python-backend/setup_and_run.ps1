# Setup and run script for FinViz Stock Screener Python backend
Write-Host "Setting up and running FinViz Stock Screener backend..." -ForegroundColor Green

# Run setup script
& .\setup.ps1

# Run server script if setup was successful
if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
    Write-Host "Setup completed successfully, starting server..." -ForegroundColor Green
    & .\start_server.ps1
} else {
    Write-Host "Setup failed with exit code $LASTEXITCODE. Please fix the issues and try again." -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 