
import React, { useState } from 'react';
import Header from '@/components/Header';
import GeneratorForm from '@/components/GeneratorForm';
import PostDisplay from '@/components/PostDisplay';
import CompanyInfoCard from '@/components/CompanyInfoCard';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);

  const handlePostGenerated = (post: string) => {
    setGeneratedPost(post);
  };

  return (
    <CompanyProvider>
      <div className="min-h-screen flex flex-col bg-[#9aedff]/30">
        <Header className="bg-white shadow-sm" />
        
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center space-y-8 pt-8">
              <div className="w-full text-center mb-8 animate-fade-in">
                <h1 className="text-5xl font-bold tracking-tight text-balance text-[#2b4a9a]">
                  Your Fleet Electrification Partner
                </h1>
                <p className="mt-4 text-xl text-[#71436d] max-w-2xl mx-auto text-balance">
                  Generate engaging social media content with just a click
                </p>
              </div>
              
              <Card className="w-full border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <GeneratorForm onPostGenerated={handlePostGenerated} />
                </CardContent>
              </Card>
              
              <div className="pt-4 w-full">
                <PostDisplay post={generatedPost} />
              </div>
              
              <Separator className="max-w-md my-6" />
              
              <div className="w-full bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-[#2b4a9a] mb-8">How We Can Help</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="fleete-card flex flex-col items-center">
                    <div className="mb-4 h-40 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/0c2a9e24-a84b-4c91-aba8-50436c21db16.png" 
                        alt="Charging Hub" 
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Charging Hubs</h3>
                  </div>
                  
                  <div className="fleete-card flex flex-col items-center">
                    <div className="mb-4 h-40 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/3e1e0857-b9c9-4003-8179-33f418bd9b0b.png" 
                        alt="Depot Electrification" 
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Depot Electrification</h3>
                  </div>
                  
                  <div className="fleete-card flex flex-col items-center">
                    <div className="mb-4 h-40 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/cf8c0e2e-75bb-4126-baa2-425fe388b6ca.png" 
                        alt="Software Platform" 
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Software Platform</h3>
                  </div>
                </div>
                
                <div className="mt-8">
                  <CompanyInfoCard />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-6 mt-auto border-t border-border/40 text-center text-sm text-[#2b4a9a] bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Fleete PostGenius. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CompanyProvider>
  );
};

export default Index;
