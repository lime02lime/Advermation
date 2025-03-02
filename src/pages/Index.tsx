
import React, { useState } from 'react';
import Header from '@/components/Header';
import GeneratorForm from '@/components/GeneratorForm';
import PostDisplay from '@/components/PostDisplay';
import CompanyInfoCard from '@/components/CompanyInfoCard';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);

  const handlePostGenerated = (post: string) => {
    setGeneratedPost(post);
  };

  return (
    <CompanyProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary">
        <Header />
        
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-full text-center mb-8 animate-fade-in">
                <h1 className="text-4xl font-medium tracking-tight text-balance">
                  Generate engaging social media content
                </h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                  Create professional marketing posts with just a click
                </p>
              </div>
              
              <GeneratorForm onPostGenerated={handlePostGenerated} />
              
              <div className="pt-4 w-full">
                <PostDisplay post={generatedPost} />
              </div>
              
              <Separator className="max-w-md my-6" />
              
              <div className="w-full">
                <CompanyInfoCard />
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-6 mt-auto border-t border-border/40 text-center text-sm text-muted-foreground">
          <div className="max-w-4xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Fleete PostGenius. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CompanyProvider>
  );
};

export default Index;
