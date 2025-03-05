"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { StockData } from '../api/stocks/screener/route';
import { Badge } from '@/registry/new-york-v4/ui/badge';

interface StockScreenerProps {
  className?: string;
}

const StockScreener: React.FC<StockScreenerProps> = ({ className }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [screenerType, setScreenerType] = useState('toplosers');
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);

  const screenerOptions = [
    { value: 'toplosers', label: 'Top Losers' },
    { value: 'topgainers', label: 'Top Gainers' },
    { value: 'mostvolatile', label: 'Most Volatile' },
    { value: 'overbought', label: 'Overbought' },
    { value: 'oversold', label: 'Oversold' },
    { value: 'mostactive', label: 'Most Active' },
    { value: 'unusualvolume', label: 'Unusual Volume' },
  ];

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching stocks with screener type: ${screenerType}`);
      const apiUrl = `/api/stocks/screener?type=${screenerType}&limit=20`;
      console.log(`API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        if (data.screenerType && data.screenerType !== screenerType) {
          console.log(`Updating screener type from ${screenerType} to ${data.screenerType}`);
          setScreenerType(data.screenerType);
        }
        
        setStocks(data.data);
        setFilteredStocks(data.data);
        setTimestamp(data.timestamp);
        
        const screenerLabel = screenerOptions.find(option => option.value === data.screenerType)?.label || data.screenerType;
        setDataSource(`FinViz (${screenerLabel})`);
      } else {
        setError(data.error || 'Failed to fetch stock data');
        setStocks([]);
        setFilteredStocks([]);
      }
    } catch (err) {
      setError('Error fetching stock data. Please try again later.');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [screenerType]);

  useEffect(() => {
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      const filtered = stocks.filter(stock => 
        stock.ticker.toLowerCase().includes(lowerFilter) || 
        stock.company.toLowerCase().includes(lowerFilter) ||
        stock.sector.toLowerCase().includes(lowerFilter)
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stocks);
    }
  }, [filter, stocks]);

  const handleScreenerChange = (value: string) => {
    console.log(`Screener changed to: ${value}`);
    setScreenerType(value);
  };

  const handleRefresh = () => {
    fetchStocks();
  };

  return (
    <Card className={`overflow-hidden border-none shadow-md ${className}`}>
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Stock Screener</CardTitle>
            <CardDescription>
              {timestamp && (
                <span className="text-xs">
                  Data from {screenerType === 'toplosers' ? 'Top Losers' : 
                            screenerType === 'topgainers' ? 'Top Gainers' : 
                            screenerType === 'newhigh' ? 'New High' : 
                            screenerType === 'newlow' ? 'New Low' : 
                            screenerType === 'unusualvolume' ? 'Unusual Volume' : 
                            'FinViz'} as of {new Date(timestamp).toLocaleString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Select
                value={screenerType}
                onValueChange={handleScreenerChange}
              >
                <SelectTrigger className="h-9 w-[180px] bg-background">
                  <SelectValue placeholder="Select screener" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toplosers">Top Losers</SelectItem>
                  <SelectItem value="topgainers">Top Gainers</SelectItem>
                  <SelectItem value="newhigh">New High</SelectItem>
                  <SelectItem value="newlow">New Low</SelectItem>
                  <SelectItem value="unusualvolume">Unusual Volume</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-background"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-primary"></div>
                    Loading
                  </div>
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
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Loading stock data...</p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <p className="text-xs text-red-500">{error}</p>
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