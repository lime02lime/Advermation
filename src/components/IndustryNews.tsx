import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Newspaper, RefreshCw, AlertCircle, Info, Database, Search } from 'lucide-react';

interface NewsItem {
  newsID: string;
  title: string;
  summary: string;
  date: string;
  source: string;
}

const mockNewsData: NewsItem[] = [
  {
    newsID: 'mock-news-1',
    title: 'Major Automaker Announces New Fleet Electrification Initiative',
    summary: 'A leading automotive manufacturer has unveiled plans to electrify 80% of their commercial fleet vehicles by 2026, partnering with utility companies to expand charging infrastructure.',
    date: new Date().toISOString(),
    source: 'EV Industry Today'
  },
  {
    newsID: 'mock-news-2',
    title: 'New Battery Technology Extends EV Range for Commercial Vehicles',
    summary: 'Researchers have developed a new battery technology that could extend the range of electric commercial vehicles by up to 40%, making fleet electrification more viable for long-haul operations.',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    source: 'Tech Innovations Weekly'
  },
  {
    newsID: 'mock-news-3',
    title: 'Government Unveils New Tax Incentives for Fleet Electrification',
    summary: 'The federal government has announced new tax credits for businesses that transition to electric fleets, covering up to 30% of vehicle purchase costs and 50% of charging infrastructure expenses.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    source: 'Policy & Regulation Report'
  }
];

const extendedMockNewsData: NewsItem[] = [
  ...mockNewsData,
  {
    newsID: 'mock-news-4',
    title: 'Leading Fleet Management Software Adds EV Analytics',
    summary: 'A popular fleet management platform has introduced new EV-specific analytics tools to help businesses track charging efficiency, range optimization, and total cost of ownership for electric vehicles.',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    source: 'Fleet Technology Review'
  },
  {
    newsID: 'mock-news-5',
    title: 'Electric Delivery Vans Achieve Cost Parity with Diesel',
    summary: 'New market analysis shows that electric delivery vans have reached total cost of ownership parity with diesel models in urban delivery routes, marking a significant milestone for fleet electrification.',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    source: 'Fleet Economics Journal'
  }
];

const IndustryNews: React.FC = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const fetchNewsFromDb = async () => {
    setError(null);
    setErrorDetails(null);
    setUsingMockData(false);
    
    try {
      setRefreshing(true);
      console.log('Fetching news data from DynamoDB...');
      
      const response = await fetch('/api/fetch-industry-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch industry news: ${response.status} ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setNewsItems(data.items);
        toast({
          title: "News loaded successfully",
          description: "Latest industry news has been loaded from the database.",
          variant: "default"
        });
      } else {
        // If no items were returned, use mock data
        throw new Error('No news items returned from database');
      }
      
    } catch (error) {
      console.error('Error loading news:', error);
      setError("Unable to connect to the news database");
      setErrorDetails("Using mock data instead. In production, this would connect to AWS DynamoDB.");
      setUsingMockData(true);
      
      // Fallback to extended mock data
      setNewsItems(extendedMockNewsData);
      
      toast({
        title: "Using demo data",
        description: "There was a problem connecting to the database. Using sample news items instead.",
        variant: "default"
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const searchNewsWithPerplexity = async () => {
    setError(null);
    setErrorDetails(null);
    setUsingMockData(false);
    
    try {
      setSearching(true);
      console.log('Searching for news with Perplexity API...');
      
      const response = await fetch('/api/search-industry-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'recent news and industry trends in delivery, transport and transport electrification'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to search industry news: ${response.status} ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setNewsItems(data.items);
        toast({
          title: "News search completed",
          description: "Latest industry news has been fetched from Perplexity AI.",
          variant: "default"
        });
      } else {
        throw new Error('No news items returned from search');
      }
      
    } catch (error) {
      console.error('Error searching news:', error);
      setError("Unable to search for news");
      setErrorDetails("Using mock data instead. In production, this would use Perplexity AI API.");
      setUsingMockData(true);
      
      // Fallback to extended mock data
      setNewsItems(extendedMockNewsData);
      
      toast({
        title: "Using demo data",
        description: "There was a problem searching for news. Using sample news items instead.",
        variant: "default"
      });
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsFromDb();
  }, []);

  if (loading && !refreshing && !searching) {
    return (
      <Card className="w-full border shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            Industry News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (newsItems.length === 0 && !loading && !refreshing && !searching) {
    return (
      <Card className="w-full border shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            Industry News
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchNewsFromDb}
              disabled={refreshing || searching}
            >
              <Database className="h-3.5 w-3.5 mr-1" />
              Load from DB
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={searchNewsWithPerplexity}
              disabled={refreshing || searching}
            >
              <Search className="h-3.5 w-3.5 mr-1" />
              Search News
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No industry news available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Newspaper className="h-4 w-4 mr-2" />
          Industry News
          {usingMockData && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md">Demo Data</span>
          )}
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchNewsFromDb}
            disabled={refreshing || searching}
          >
            {refreshing ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Database className="h-3.5 w-3.5 mr-1" />
            )}
            Load from DB
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={searchNewsWithPerplexity}
            disabled={refreshing || searching}
          >
            {searching ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5 mr-1" />
            )}
            Search News
          </Button>
        </div>
      </CardHeader>
      {error && (
        <div className="px-6 py-2 flex items-center text-xs text-amber-800 bg-amber-50 border-t border-b border-amber-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>{error}</span>
        </div>
      )}
      {errorDetails && (
        <div className="px-6 py-2 flex items-center text-xs text-blue-800 bg-blue-50 border-b border-blue-100">
          <Info className="h-3 w-3 mr-1" />
          <span>{errorDetails}</span>
        </div>
      )}
      {usingMockData && (
        <div className="px-6 py-2 flex items-center text-xs text-emerald-800 bg-emerald-50 border-b border-emerald-100">
          <Database className="h-3 w-3 mr-1" />
          <span>Using mock data. To use real data, ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set correctly.</span>
        </div>
      )}
      <CardContent className="px-4 py-2">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {newsItems.map((item, index) => (
            <div key={item.newsID} className="space-y-1">
              <h3 className="font-medium text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3">{item.summary}</p>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span>{item.source}</span>
              </div>
              {index < newsItems.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryNews;
