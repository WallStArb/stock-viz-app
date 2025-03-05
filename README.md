# Stock Visualization App

A modern web application for visualizing stock market data using Next.js and Python.

## Overview

This application provides real-time stock market data visualization with a clean, modern UI. It consists of:

- **Next.js Frontend**: A responsive web interface built with Next.js 15, React 19, and Tailwind CSS
- **Python Backend**: A Flask API that scrapes and processes stock data from FinViz

## Features

- Real-time stock data visualization
- Top gainers and losers tracking
- Modern, responsive UI with dark mode support
- RESTful API for stock data retrieval

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Recharts for data visualization

### Backend
- Python 3
- Flask
- Beautiful Soup for web scraping
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/WallStArb/stock-viz-app.git
   cd stock-viz-app
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Start the Python backend:
   ```
   ./run-python-backend.ps1
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## License

MIT
