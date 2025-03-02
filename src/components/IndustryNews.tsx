
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Newspaper, RefreshCw } from 'lucide-react';

interface NewsItem {
  newsID: string;
  title: string;
  summary: string;
  date: string;
  source: string;
}

const IndustryNews: React.FC = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fetch-industry-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch industry news');
      }

      const data = await response.json();
      setNewsItems(data.items || []);
    } catch (error) {
      console.error('Error fetching industry news:', error);
      toast({
        title: "Failed to load industry news",
        description: "Please try again later.",
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
      title: "News refreshed",
      description: "Latest industry news has been loaded."
    });
  };

  useEffect(() => {
    fetchNews();
  }, [toast]);

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
