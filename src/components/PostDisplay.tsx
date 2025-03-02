
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
  const [editedPost, setEditedPost] = useState<string>('');
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update editedPost when post changes
    if (post) {
      setEditedPost(post);
    }
    // Reset copied state when post changes
    setCopied(false);
  }, [post]);

  const handleCopy = async () => {
    if (!editedPost) return;
    
    try {
      // Copy the edited content
      await navigator.clipboard.writeText(editedPost);
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

  const handleTextChange = () => {
    if (editableRef.current) {
      setEditedPost(editableRef.current.innerText);
    }
  };

  if (!post) {
    return (
      <Card className="w-full max-w-xl mx-auto bg-white border border-border/50 shadow-soft min-h-[200px] flex items-center justify-center text-muted-foreground animate-slide-up">
        <CardContent className="p-6 text-center w-full">
          <p>Generate a post to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto bg-white border-0 shadow-lg transition-all duration-300 animate-slide-up">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full mb-2 text-xs text-[#71436d] text-left">
          <span className="italic">You can edit this text directly</span>
        </div>
        <div
          ref={editableRef}
          contentEditable
          onInput={handleTextChange}
          className="font-medium text-balance text-[15px] leading-relaxed text-center w-full focus:outline-none focus:ring-1 focus:ring-primary/20 rounded p-2 bg-white"
          suppressContentEditableWarning={true}
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
