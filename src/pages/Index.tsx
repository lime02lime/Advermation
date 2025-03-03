
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import GeneratorForm from '@/components/GeneratorForm';
import PostDisplay from '@/components/PostDisplay';
import IndustryNews from '@/components/IndustryNews';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

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

const Index = () => {
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
  const postDisplayRef = useRef<HTMLDivElement>(null);

  const handlePostGenerated = (post: string) => {
    setGeneratedPost(post);
    
    // Schedule the scroll for the next tick to ensure DOM has updated
    setTimeout(() => {
      if (postDisplayRef.current) {
        // Check if the post is already visible in the viewport
        const rect = postDisplayRef.current.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
        
        // Only scroll if the post is not fully visible
        if (!isVisible) {
          postDisplayRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }, 100);
  };

  const handleSelectedNewsChange = (news: NewsItem[]) => {
    setSelectedNews(news);
  };

  return (
    <CompanyProvider>
      <div className="min-h-screen flex flex-col bg-[#9aedff]/30">
        <Header className="bg-white shadow-sm" />
        
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-6xl mx-auto w-full pt-8">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-balance text-[#2b4a9a]">
                Internal Content Generator
              </h1>
              <p className="mt-4 text-lg text-[#71436d] max-w-xl mx-auto text-balance">
                Create engaging social media content for Fleete with just a click
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1">
                <Card className="w-full border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <GeneratorForm onPostGenerated={handlePostGenerated} selectedNews={selectedNews} />
                  </CardContent>
                </Card>
                
                <div ref={postDisplayRef} className="pt-4 w-full">
                  <PostDisplay post={generatedPost} />
                </div>
                
                <Separator className="max-w-md mx-auto my-6" />
              </div>
              
              {/* News Sidebar - Now aligned with top content */}
              <div className="w-full md:w-80 lg:w-96">
                <IndustryNews onSelectedNewsChange={handleSelectedNewsChange} />
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-4 mt-auto border-t border-border/40 text-center text-sm text-[#2b4a9a] bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Fleete Internal Tools - PostGenius</p>
          </div>
        </footer>
      </div>
    </CompanyProvider>
  );
};

export default Index;
