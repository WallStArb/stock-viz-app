import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface TableDetail {
  index: number;
  rows: number;
  cols: number;
  classes: string;
  id: string;
  firstRowText: string;
}

export async function GET() {
  try {
    // Fetch data from FinViz
    const response = await axios.get('https://finviz.com/screener.ashx?v=110&s=ta_toplosers', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Debug information
    const tables = $('table').length;
    const tableDetails: TableDetail[] = [];
    
    $('table').each((i, table) => {
      const rows = $(table).find('tr').length;
      const cols = $(table).find('tr:first-child td, tr:first-child th').length;
      const classes = $(table).attr('class') || 'no-class';
      const id = $(table).attr('id') || 'no-id';
      
      tableDetails.push({
        index: i,
        rows,
        cols,
        classes,
        id,
        firstRowText: $(table).find('tr:first-child').text().substring(0, 100)
      });
    });
    
    // Look for specific elements that might contain stock data
    const possibleStockTables = tableDetails.filter(t => 
      t.rows > 5 && t.cols > 5 // Stock tables typically have many rows and columns
    );
    
    // Check for the screener navigation
    const paginationText = $('.screener-pages').text();
    
    return NextResponse.json({
      success: true,
      totalTables: tables,
      tableDetails,
      possibleStockTables,
      paginationText: paginationText || 'Pagination not found',
      htmlLength: html.length
    });
  } catch (error) {
    console.error('Error parsing FinViz data:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 