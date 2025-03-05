#!/usr/bin/env python
"""
Flask API for scraping FinViz stock screener data
"""

import json
import datetime
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import html5lib

app = Flask(__name__)
CORS(app)

def fetch_finviz_page(url, headers):
    """
    Fetch a page from FinViz with proper headers
    """
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        return response.text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch data: {str(e)}")

def parse_stock_table(html_content):
    """
    Parse the HTML content to extract the stock table
    """
    soup = BeautifulSoup(html_content, 'html5lib')
    
    # Look for the stock table - based on our analysis, it's the table with class 'styled-table-new'
    stock_table = soup.find('table', class_='styled-table-new')
    
    # If not found, try to find a table with headers matching stock data
    if not stock_table:
        # Look for tables with many rows
        tables = soup.find_all('table')
        for table in tables:
            rows = table.find_all('tr')
            if len(rows) > 5:  # Stock tables typically have many rows
                # Check if this table has the expected headers
                headers = [th.text.strip() for th in rows[0].find_all('th') if th.text.strip()]
                if not headers:  # Sometimes headers are in td elements
                    headers = [td.text.strip() for td in rows[0].find_all('td') if td.text.strip()]
                
                # Check if these look like stock headers
                stock_header_keywords = ['ticker', 'company', 'sector', 'price', 'change', 'volume']
                header_text = ' '.join(headers).lower()
                
                if any(keyword in header_text for keyword in stock_header_keywords):
                    stock_table = table
                    break
    
    if not stock_table:
        raise Exception("Could not find stock table in the HTML")
    
    return stock_table

def extract_stock_data(stock_table, limit):
    """
    Extract stock data from the table
    """
    # Extract headers
    headers_row = stock_table.find('tr')
    headers = []
    
    # Try to get headers from th elements
    th_elements = headers_row.find_all('th')
    if th_elements:
        headers = [th.text.strip() for th in th_elements if th.text.strip()]
    
    # If no th elements, try td elements
    if not headers:
        headers = [td.text.strip() for td in headers_row.find_all('td') if td.text.strip()]
    
    # Extract stock data rows
    stock_rows = stock_table.find_all('tr')[1:]  # Skip header row
    all_stocks = []
    
    for row in stock_rows:
        cells = row.find_all('td')
        if len(cells) >= 10:  # Ensure we have enough cells
            # Extract data from cells
            ticker_cell = cells[1]
            ticker = ticker_cell.text.strip()
            
            # Skip if this is not a valid stock row
            if not ticker or ticker == "Ticker":
                continue
            
            # Extract other data
            company = cells[2].text.strip()
            sector = cells[3].text.strip()
            industry = cells[4].text.strip()
            country = cells[5].text.strip()
            market_cap = cells[6].text.strip()
            pe = cells[7].text.strip()
            price = cells[8].text.strip()
            change = cells[9].text.strip()
            volume = cells[10].text.strip() if len(cells) > 10 else "N/A"
            
            # Create stock data object
            stock_data = {
                'ticker': ticker,
                'company': company,
                'sector': sector,
                'industry': industry,
                'country': country,
                'market_cap': market_cap,
                'pe': pe,
                'price': price,
                'change': change,
                'volume': volume
            }
            
            all_stocks.append(stock_data)
            
            # Stop if we've reached the limit
            if len(all_stocks) >= limit:
                break
    
    return all_stocks

@app.route('/api/finviz/screener', methods=['GET'])
def get_finviz_screener():
    """
    Fetch stock data from FinViz screener
    """
    try:
        # Get the screener URL from query parameters, default to Top Losers
        screener_url = request.args.get('url', 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers')
        
        # Get the limit from query parameters, default to 100
        limit = int(request.args.get('limit', 100))
        
        # Calculate number of pages needed (FinViz shows 20 stocks per page)
        pages_needed = (limit + 19) // 20  # Ceiling division
        
        # Generate timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Browser-like headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        
        all_stocks = []
        
        # Loop through pages
        for page in range(1, pages_needed + 1):
            # Construct URL with pagination
            page_offset = (page - 1) * 20
            if page_offset > 0:
                page_url = f"{screener_url}&r={page_offset + 1}"
            else:
                page_url = screener_url
            
            # Fetch page content
            html_content = fetch_finviz_page(page_url, headers)
            
            # Parse stock table
            stock_table = parse_stock_table(html_content)
            
            # Extract stock data
            page_stocks = extract_stock_data(stock_table, limit - len(all_stocks))
            all_stocks.extend(page_stocks)
            
            # Stop pagination if we've reached the limit
            if len(all_stocks) >= limit:
                break
        
        # Return JSON response
        return jsonify({
            'success': True,
            'data': all_stocks[:limit],  # Ensure we don't exceed the limit
            'url': screener_url,
            'count': len(all_stocks),
            'timestamp': timestamp
        })
    
    except Exception as e:
        # Return error response
        return jsonify({
            'success': False,
            'error': str(e),
            'url': request.args.get('url', 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers')
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 