
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCompany } from '@/contexts/CompanyContext';
import { Badge } from "@/components/ui/badge";

const CompanyInfoCard: React.FC = () => {
  const { companyInfo } = useCompany();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full max-w-xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft animate-slide-up overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Company Information</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={`pt-0 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden`}>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Industry</div>
            <div>{companyInfo.industry}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Target Audience</div>
            <div>{companyInfo.targetAudience}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Unique Selling Points</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {companyInfo.uniqueSellingPoints.map((point, index) => (
                <Badge key={index} variant="secondary" className="font-normal text-xs">
                  {point}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Solutions</div>
            <div className="space-y-2 mt-1">
              {companyInfo.solutions?.map((solution, index) => (
                <div key={index} className="p-2 bg-secondary/20 rounded-md">
                  <div className="font-medium">{solution.name}</div>
                  <div className="text-xs text-muted-foreground">{solution.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Tone</div>
            <div>{companyInfo.tone}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Description</div>
            <div className="text-sm text-muted-foreground">
              {companyInfo.description}
            </div>
          </div>
        </div>
      </CardContent>
      
      {!isExpanded && (
        <>
          <Separator />
          <CardFooter className="pt-3 pb-4 px-6">
            <div className="text-xs text-muted-foreground">
              Fleete's company information is being used to generate relevant social media posts
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default CompanyInfoCard;
