import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Newspaper, RefreshCw, AlertCircle } from 'lucide-react';

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

const IndustryNews: React.FC = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setError(null);
    try {
      setLoading(true);
      console.log('Fetching news from API...');
      
      const response = await fetch('/api/fetch-industry-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch industry news: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('News data received:', data);
      
      if (data.items && data.items.length > 0) {
        setNewsItems(data.items);
        setUseMockData(false);
      } else {
        console.log('No news items found, using mock data');
        setNewsItems(mockNewsData);
        setUseMockData(true);
        toast({
          title: "No news items found",
          description: "Using demo data instead. Please check your database.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching industry news:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      // Fall back to mock data when the API fails
      setNewsItems(mockNewsData);
      setUseMockData(true);
      toast({
        title: "Using demo data",
        description: "Could not connect to news service. Showing sample news items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    toast({
      title: useMockData ? "Demo data loaded" : "News refreshed",
      description: useMockData 
        ? "Using sample news data for demonstration purposes." 
        : "Latest industry news has been loaded."
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading && !refreshing) {
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

  if (newsItems.length === 0 && !loading) {
    return (
      <Card className="w-full border shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            Industry News
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
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
          {useMockData && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md">Demo Data</span>}
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
          )}
          Refresh
        </Button>
      </CardHeader>
      {error && (
        <div className="px-6 py-2 flex items-center text-xs text-amber-800 bg-amber-50 border-t border-b border-amber-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Error: {error}</span>
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
