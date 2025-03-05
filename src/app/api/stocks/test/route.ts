import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Get the URL from query parameters or use a default
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url') || 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers';
    
    // Send request with headers to mimic a browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    };
    
    const response = await axios.get(url, { 
      headers,
      timeout: 10000 // 10 second timeout
    });
    
    // Return the first 5000 characters of the response
    const htmlPreview = response.data.substring(0, 5000);
    
    return NextResponse.json({
      success: true,
      url,
      status: response.status,
      contentType: response.headers['content-type'],
      htmlPreview,
      contentLength: response.data.length
    });
    
  } catch (error: any) {
    console.error('Error in test endpoint:', error);
    
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data ? error.response.data.substring(0, 1000) : null
      } : null
    }, { status: 500 });
  }
} 