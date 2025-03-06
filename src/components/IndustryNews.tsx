import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Info, Database, ExternalLink, Newspaper, CheckCircle, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NewsItem {
  newsID: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  dateAdded?: string;
  sourceLink?: string;
  selected?: boolean;
}

const mockNewsData: NewsItem[] = [
  {
    newsID: 'mock-news-1',
    title: 'Major Automaker Announces New Fleet Electrification Initiative',
    summary: 'A leading automotive manufacturer has unveiled plans to electrify 80% of their commercial fleet vehicles by 2026, partnering with utility companies to expand charging infrastructure.',
    date: new Date().toISOString(),
    source: 'EV Industry Today',
    dateAdded: new Date().toISOString()
  },
  {
    newsID: 'mock-news-2',
    title: 'New Battery Technology Extends EV Range for Commercial Vehicles',
    summary: 'Researchers have developed a new battery technology that could extend the range of electric commercial vehicles by up to 40%, making fleet electrification more viable for long-haul operations.',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    source: 'Tech Innovations Weekly',
    dateAdded: new Date().toISOString()
  },
  {
    newsID: 'mock-news-3',
    title: 'Government Unveils New Tax Incentives for Fleet Electrification',
    summary: 'The federal government has announced new tax credits for businesses that transition to electric fleets, covering up to 30% of vehicle purchase costs and 50% of charging infrastructure expenses.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    source: 'Policy & Regulation Report',
    dateAdded: new Date().toISOString()
  }
];

const extendedMockNewsData: NewsItem[] = [
  ...mockNewsData,
  {
    newsID: 'mock-news-4',
    title: 'Leading Fleet Management Software Adds EV Analytics',
    summary: 'A popular fleet management platform has introduced new EV-specific analytics tools to help businesses track charging efficiency, range optimization, and total cost of ownership for electric vehicles.',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    source: 'Fleet Technology Review',
    dateAdded: new Date().toISOString()
  },
  {
    newsID: 'mock-news-5',
    title: 'Electric Delivery Vans Achieve Cost Parity with Diesel',
    summary: 'New market analysis shows that electric delivery vans have reached total cost of ownership parity with diesel models in urban delivery routes, marking a significant milestone for fleet electrification.',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    source: 'Fleet Economics Journal',
    dateAdded: new Date().toISOString()
  }
];

interface IndustryNewsProps {
  onSelectedNewsChange?: (selectedNews: NewsItem[]) => void;
}

const IndustryNews: React.FC<IndustryNewsProps> = ({ onSelectedNewsChange }) => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [savedToDynamoDB, setSavedToDynamoDB] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  
  const fetchNewsFromDb = async () => {
    setError(null);
    setErrorDetails(null);
    setUsingMockData(false);
    setSavedToDynamoDB(false);
    setSavedCount(0);
    
    try {
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
          description: `${data.items.length} news items loaded from the database.`,
          variant: "default"
        });
      } else {
        throw new Error('No news items returned from database');
      }
      
    } catch (error) {
      console.error('Error loading news:', error);
      setError("Unable to connect to the news database");
      setErrorDetails("Using mock data instead. In production, this would connect to AWS DynamoDB.");
      setUsingMockData(true);
      
      setNewsItems(extendedMockNewsData);
      
      toast({
        title: "Using demo data",
        description: "There was a problem connecting to the database. Using sample news items instead.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsFromDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onSelectedNewsChange) {
      const selectedNews = newsItems.filter(item => item.selected);
      onSelectedNewsChange(selectedNews);
    }
  }, [newsItems, onSelectedNewsChange]);

  const toggleNewsSelection = (newsID: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.newsID === newsID 
          ? { ...item, selected: !item.selected } 
          : item
      )
    );
  };

  if (loading) {
    return (
      <Card className="w-full h-full border shadow-sm flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            Industry News
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="animate-pulse space-y-3 h-full">
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

  return (
    <Card className="w-full h-full border shadow-sm flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Newspaper className="h-4 w-4 mr-2" />
          Industry News
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md inline-flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Click to select
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Select news items to include in your post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {usingMockData && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md">Demo Data</span>
          )}
          {savedToDynamoDB && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-md flex items-center">
              Saved ({savedCount})
            </span>
          )}
        </CardTitle>
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
      <CardContent className="px-4 py-2 flex-grow flex flex-col">
        <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
          {newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <div key={item.newsID}>
                <div 
                  className={`space-y-1 p-2 rounded-md transition-colors ${item.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleNewsSelection(item.newsID)}
                  role="button"
                  aria-pressed={item.selected}
                >
                  <div className="flex items-start gap-2">
                    {item.selected ? 
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" /> : 
                      <Circle className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    }
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">{item.summary}</p>
                      <div className="flex flex-col text-[10px] text-muted-foreground mt-1">
                        <div className="flex justify-between items-center">
                          <span>Published: {new Date(item.date).toLocaleDateString()}</span>
                          <span className="flex items-center">
                            {item.source}
                            {item.sourceLink && (
                              <a 
                                href={item.sourceLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-1 text-blue-500 hover:text-blue-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </span>
                        </div>
                        {item.dateAdded && (
                          <div className="text-[9px] text-muted-foreground">
                            Added to database: {new Date(item.dateAdded).toLocaleDateString()} {new Date(item.dateAdded).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < newsItems.length - 1 && (
                  <Separator className="my-3" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No industry news available at the moment.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryNews;
