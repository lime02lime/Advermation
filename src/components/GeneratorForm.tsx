import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from '@/contexts/CompanyContext';
import { generatePost } from '@/services/postGenerationService';
import { Send, ArrowRight, Newspaper } from 'lucide-react';

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

interface GeneratorFormProps {
  onPostGenerated: (post: string) => void;
  selectedNews?: NewsItem[];
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onPostGenerated, selectedNews = [] }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { companyInfo } = useCompany();
  const { toast } = useToast();

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleGenericGeneration = async () => {
    try {
      setIsGenerating(true);
      
      const generatedPost = await generatePost({
        companyName: companyInfo.name,
        companyDescription: companyInfo.description,
        industry: companyInfo.industry,
        targetAudience: companyInfo.targetAudience,
        uniqueSellingPoints: companyInfo.uniqueSellingPoints,
        tone: companyInfo.tone,
        selectedNews
      });
      
      onPostGenerated(generatedPost);
      toast({
        title: "Post Generated",
        description: "Your social media post has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your post. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTopicGeneration = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate a focused post.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const generatedPost = await generatePost({
        companyName: companyInfo.name,
        companyDescription: companyInfo.description,
        industry: companyInfo.industry,
        targetAudience: companyInfo.targetAudience,
        uniqueSellingPoints: companyInfo.uniqueSellingPoints,
        tone: companyInfo.tone,
        topic: topic,
        selectedNews
      });
      
      onPostGenerated(generatedPost);
      toast({
        title: "Post Generated",
        description: `Your topic-focused post about "${topic}" has been created.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your post. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-8 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-none">Generate Posts with AI</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create engaging content for your social media
            </p>
          </div>
        </div>
        
        {selectedNews.length > 0 && (
          <div className="space-y-2 bg-blue-50 p-3 rounded-md w-full">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-medium text-blue-700">Using Selected News in Generation</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedNews.map(news => (
                <Badge key={news.newsID} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {news.title.length > 30 ? news.title.substring(0, 30) + '...' : news.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <h3 className="text-base font-medium leading-none">Generate Standard Post</h3>
            <p className="text-sm text-muted-foreground">
              Create a post based on pre-defined company information
            </p>
          </div>
          <Button 
            onClick={handleGenericGeneration} 
            className="w-full transition-all duration-300 hover:translate-y-[-2px]"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Post'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <h3 className="text-base font-medium leading-none">Generate Topic-Focused Post</h3>
            <p className="text-sm text-muted-foreground">
              Create a post focused on a specific topic or theme
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Enter a topic (e.g., fuel efficiency, driver safety)"
              value={topic}
              onChange={handleTopicChange}
              className="flex-1 focus-visible:ring-1 focus-visible:ring-ring transition-shadow duration-200 bg-[#f0f9ff]"
              disabled={isGenerating}
            />
            <Button 
              onClick={handleTopicGeneration}
              disabled={isGenerating || !topic.trim()}
              className="transition-all duration-300 hover:translate-y-[-2px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;
