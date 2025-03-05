# FinViz Stock Screener API

This is a Python Flask API that scrapes stock data from FinViz stock screener and provides it in a JSON format.

## Requirements

- Python 3.8 or higher
- pip (Python package installer)

## Setup

### Windows (PowerShell)

1. Open PowerShell in the `python-backend` directory
2. Run the setup script:
   ```
   .\setup.ps1
   ```
   This will:
   - Create a virtual environment
   - Activate the virtual environment
   - Install all required dependencies

### Manual Setup (Any OS)

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows (PowerShell):
     ```
     .\venv\Scripts\Activate.ps1
     ```
   - Windows (Command Prompt):
     ```
     venv\Scripts\activate.bat
     ```
   - Linux/Mac:
     ```
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

### Windows (PowerShell)

1. Run the start server script:
   ```
   .\start_server.ps1
   ```

### One-Step Setup and Run (Windows PowerShell)

1. Run the combined setup and run script:
   ```
   .\setup_and_run.ps1
   ```

### Manual Run (Any OS)

1. Activate the virtual environment (if not already activated)
2. Run the Flask application:
   ```
   python run.py
   ```

The server will start on `http://localhost:5000`.

## API Endpoints

### Get Stock Data

```
GET /api/finviz/screener
```

#### Query Parameters

- `url` (optional): The FinViz screener URL to scrape. Default is the Top Losers screener.
- `limit` (optional): Maximum number of stocks to return. Default is 100.

#### Example

```
GET http://localhost:5000/api/finviz/screener?url=https://finviz.com/screener.ashx?v=110&s=ta_topgainers&limit=20
```

### Health Check

```
GET /api/health
```

Returns a simple status message to verify the API is running.

## Response Format

```json
{
  "success": true,
  "data": [
    {
      "ticker": "AAPL",
      "company": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "country": "USA",
      "market_cap": "2.82T",
      "pe": "30.42",
      "price": "182.63",
      "change": "1.25%",
      "volume": "64.25M"
    },
    // More stocks...
  ],
  "url": "https://finviz.com/screener.ashx?v=110&s=ta_topgainers",
  "count": 20,
  "timestamp": "2023-06-01 12:34:56"
}
```

## Error Response

```json
{
  "success": false,
  "error": "Error message",
  "url": "https://finviz.com/screener.ashx?v=110&s=ta_toplosers"
}
```

## Features

- Scrapes stock data from FinViz screeners (Top Losers, Top Gainers, etc.)
- Provides a RESTful API endpoint to fetch stock data
- Supports pagination to fetch a specified number of stocks
- Includes timestamp information for when the data was fetched

## Notes

- This backend scrapes data from FinViz, which may have terms of service restrictions on scraping. This implementation is for educational purposes only.
- The server includes appropriate headers to mimic a browser, but excessive requests may be rate-limited by FinViz.
- For production use, consider using official APIs or data providers. 