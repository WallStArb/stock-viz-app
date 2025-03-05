'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/registry/new-york-v4/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/registry/new-york-v4/ui/badge';

// Define the stock data interface
interface StockData {
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

interface ScreenerResponse {
  success: boolean;
  data: StockData[];
  url: string;
  count: number;
  timestamp: string;
  limit: number;
}

// Python backend API URL - change this to your actual backend URL
const API_URL = 'http://localhost:5000';

const StockScreener = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [screenerType, setScreenerType] = useState('top_losers');
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);

  const screenerOptions = [
    { value: 'top_losers', label: 'Top Losers', url: 'https://finviz.com/screener.ashx?v=110&s=ta_toplosers' },
    { value: 'top_gainers', label: 'Top Gainers', url: 'https://finviz.com/screener.ashx?v=110&s=ta_topgainers' },
    { value: 'new_high', label: 'New High', url: 'https://finviz.com/screener.ashx?v=110&s=ta_newhigh' },
    { value: 'new_low', label: 'New Low', url: 'https://finviz.com/screener.ashx?v=110&s=ta_newlow' },
    { value: 'most_volatile', label: 'Most Volatile', url: 'https://finviz.com/screener.ashx?v=110&s=ta_mostvolatile' },
    { value: 'most_active', label: 'Most Active', url: 'https://finviz.com/screener.ashx?v=110&s=ta_mostactive' },
    { value: 'unusual_volume', label: 'Unusual Volume', url: 'https://finviz.com/screener.ashx?v=110&s=ta_unusualvolume' },
    { value: 'overbought', label: 'Overbought', url: 'https://finviz.com/screener.ashx?v=110&s=ta_overbought' },
    { value: 'oversold', label: 'Oversold', url: 'https://finviz.com/screener.ashx?v=110&s=ta_oversold' },
  ];

  // Function to fetch stock data from our Next.js API
  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedScreener = screenerOptions.find(option => option.value === screenerType);
      if (!selectedScreener) {
        throw new Error('Invalid screener type');
      }
      
      console.log(`Fetching stocks with screener type: ${screenerType}`);
      
      // Map our internal screener types to the API's expected types
      const apiScreenerType = screenerType.replaceAll('_', '');
      
      // Call our Next.js API route with the type parameter
      const response = await axios.get(`/api/stocks/screener`, {
        params: {
          type: apiScreenerType,
          limit: limit
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setStocks(response.data.data);
        setTimestamp(response.data.timestamp);
      } else {
        setError('Failed to fetch stock data. Please try again later.');
      }
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when screener type changes
  useEffect(() => {
    fetchStockData();
  }, [screenerType]);

  // Filter stocks based on search input
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(filter.toLowerCase()) ||
      stock.company.toLowerCase().includes(filter.toLowerCase()) ||
      stock.sector.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Stock Screener</CardTitle>
            <CardDescription>
              {screenerOptions.find(option => option.value === screenerType)?.url && timestamp && (
                <span className="text-xs">
                  Data from {screenerOptions.find(option => option.value === screenerType)?.label} as of {new Date(timestamp).toLocaleString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Select
                value={screenerType}
                onValueChange={(value) => setScreenerType(value)}
              >
                <SelectTrigger className="h-9 w-[180px] bg-background">
                  <SelectValue placeholder="Select screener" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toplosers">Top Losers</SelectItem>
                  <SelectItem value="topgainers">Top Gainers</SelectItem>
                  <SelectItem value="mostvolatile">Most Volatile</SelectItem>
                  <SelectItem value="unusual">Unusual Volume</SelectItem>
                  <SelectItem value="newhigh">New High</SelectItem>
                  <SelectItem value="newlow">New Low</SelectItem>
                  <SelectItem value="overbought">Overbought</SelectItem>
                  <SelectItem value="oversold">Oversold</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-background"
                onClick={fetchStockData}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Filter stocks..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-9 pl-8 bg-background"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[8%] py-1.5 px-2 text-left font-semibold whitespace-nowrap">Ticker</TableHead>
                <TableHead className="w-[22%] py-1.5 px-2 text-left font-semibold">Company</TableHead>
                <TableHead className="w-[12%] py-1.5 px-2 text-left font-semibold whitespace-nowrap">Sector</TableHead>
                <TableHead className="w-[18%] py-1.5 px-2 hidden md:table-cell text-left font-semibold">Industry</TableHead>
                <TableHead className="w-[8%] py-1.5 px-2 hidden lg:table-cell text-left font-semibold whitespace-nowrap">Country</TableHead>
                <TableHead className="w-[8%] py-1.5 px-2 text-right font-semibold whitespace-nowrap">Price</TableHead>
                <TableHead className="w-[8%] py-1.5 px-2 text-right font-semibold whitespace-nowrap">Change</TableHead>
                <TableHead className="w-[16%] py-1.5 px-2 hidden md:table-cell text-right font-semibold whitespace-nowrap">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-1 text-xs text-muted-foreground">Loading stock data...</p>
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <p className="text-xs text-muted-foreground">No stocks found matching your criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStocks.map((stock) => (
                  <TableRow key={stock.ticker} className="hover:bg-muted/30 border-b border-gray-200 dark:border-gray-800">
                    <TableCell className="py-1.5 px-2 font-medium whitespace-nowrap">
                      <Badge variant="outline" className="font-medium bg-background">
                        {stock.ticker}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1.5 px-2 truncate max-w-[200px]">{stock.company}</TableCell>
                    <TableCell className="py-1.5 px-2 truncate">{stock.sector}</TableCell>
                    <TableCell className="py-1.5 px-2 hidden md:table-cell truncate">{stock.industry}</TableCell>
                    <TableCell className="py-1.5 px-2 hidden lg:table-cell truncate">{stock.country}</TableCell>
                    <TableCell className="py-1.5 px-2 text-right whitespace-nowrap font-medium">${stock.price}</TableCell>
                    <TableCell 
                      className={`py-1.5 px-2 text-right font-medium whitespace-nowrap ${
                        stock.change.startsWith('-') 
                          ? 'text-red-600' 
                          : (parseFloat(stock.change) > 0 ? 'text-green-600' : 'text-gray-600')
                      }`}
                    >
                      {stock.change}
                    </TableCell>
                    <TableCell className="py-1.5 px-2 hidden md:table-cell text-right whitespace-nowrap">{stock.volume}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 py-3 px-4 text-xs text-muted-foreground">
        <div>Showing {filteredStocks.length} of {stocks.length} stocks</div>
        <div>Data provided by FinViz</div>
      </CardFooter>
    </Card>
  );
};

export default StockScreener;