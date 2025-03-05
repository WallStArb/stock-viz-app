import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define the stock data interface
export interface StockData {
  ticker: string;
  company: string;
  sector: string;
  industry: string;
  country: string;
  market_cap: string;
  pe: string;
  price: string;
  change: string;
  volume: string;
}

// Define the response interface
interface FinvizResponse {
  success: boolean;
  data: StockData[];
  url: string;
  count: number;
  timestamp: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  // Get the screener type from the query parameters
  const { searchParams } = new URL(request.url);
  const screenerType = searchParams.get('type') || 'toplosers';
  
  console.log(`API received request with screener type: ${screenerType}`);
  
  // Map screener type to FinViz URL
  const screenerUrls: Record<string, string> = {
    top_losers: 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers',
    top_gainers: 'https://finviz.com/screener.ashx?v=110&s=ta_topgainers',
    most_volatile: 'https://finviz.com/screener.ashx?v=110&s=ta_mostvolatile',
    overbought: 'https://finviz.com/screener.ashx?v=110&s=ta_overbought',
    oversold: 'https://finviz.com/screener.ashx?v=110&s=ta_oversold',
    most_active: 'https://finviz.com/screener.ashx?v=110&s=ta_mostactive',
    new_high: 'https://finviz.com/screener.ashx?v=110&s=ta_newhigh',
    new_low: 'https://finviz.com/screener.ashx?v=110&s=ta_newlow',
    unusual_volume: 'https://finviz.com/screener.ashx?v=110&s=ta_unusualvolume',
    // For backward compatibility
    toplosers: 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers',
    topgainers: 'https://finviz.com/screener.ashx?v=110&s=ta_topgainers',
    mostvolatile: 'https://finviz.com/screener.ashx?v=110&s=ta_mostvolatile',
    mostactive: 'https://finviz.com/screener.ashx?v=110&s=ta_mostactive',
    unusualvolume: 'https://finviz.com/screener.ashx?v=110&s=ta_unusualvolume',
    newhigh: 'https://finviz.com/screener.ashx?v=110&s=ta_newhigh',
    newlow: 'https://finviz.com/screener.ashx?v=110&s=ta_newlow',
  };
  
  // Validate the screener type
  const validScreenerType = Object.keys(screenerUrls).includes(screenerType) 
    ? screenerType 
    : 'top_losers';
  
  if (validScreenerType !== screenerType) {
    console.log(`Invalid screener type: ${screenerType}, using default: ${validScreenerType}`);
  }
  
  const finvizUrl = screenerUrls[validScreenerType];
  
  console.log(`Mapped screener type ${validScreenerType} to URL: ${finvizUrl}`);
  
  try {
    console.log(`Fetching data from Python backend for ${validScreenerType} (${finvizUrl})`);
    
    // Get the limit from query parameters, default to 100
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Call the Python backend
    const pythonBackendUrl = `http://localhost:5000/api/finviz/screener?url=${encodeURIComponent(finvizUrl)}&limit=${limit}`;
    console.log(`Python backend URL: ${pythonBackendUrl}`);
    
    const response = await axios.get<FinvizResponse>(pythonBackendUrl, { timeout: 10000 });
    console.log(`Python backend response status: ${response.status}`);
    
    if (response.data.success) {
      console.log(`Successfully fetched ${response.data.count} stocks from Python backend for ${validScreenerType}`);
      return NextResponse.json({
        ...response.data,
        screenerType: validScreenerType // Include the validated screener type in the response
      });
    } else {
      console.error('Python backend returned error:', response.data.error);
      throw new Error(response.data.error || 'Unknown error from Python backend');
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${validScreenerType}:`, error);
    
    // Return error response
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: finvizUrl,
      data: [],
      count: 0,
      timestamp: new Date().toISOString(),
      screenerType: validScreenerType // Include the validated screener type in the response
    }, { status: 500 });
  }
} 