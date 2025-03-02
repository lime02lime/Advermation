
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Share } from 'lucide-react';

interface PostDisplayProps {
  post: string | null;
}

const PostDisplay: React.FC<PostDisplayProps> = ({ post }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset copied state when post changes
    setCopied(false);
  }, [post]);

  const handleCopy = async () => {
    if (!post) return;
    
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "The post has been copied to your clipboard."
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  if (!post) {
    return (
      <Card className="w-full max-w-xl bg-secondary/30 backdrop-blur-sm border border-border/50 shadow-soft min-h-[200px] flex items-center justify-center text-muted-foreground animate-slide-up">
        <CardContent className="p-6 text-center">
          <p>Generate a post to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft transition-all duration-300 animate-slide-up`}>
      <CardContent className="p-6">
        <div
          ref={postRef}
          className="font-medium text-balance text-[15px] leading-relaxed text-center"
        >
          {post}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          className={`transition-all duration-300 ${copied ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={handleCopy}
        >
          <Share className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Post'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostDisplay;
