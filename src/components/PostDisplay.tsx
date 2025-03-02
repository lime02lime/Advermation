
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Share, Image } from 'lucide-react';

interface PostDisplayProps {
  post: string | null;
}

const PostDisplay: React.FC<PostDisplayProps> = ({ post }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [editedPost, setEditedPost] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update editedPost when post changes
    if (post) {
      setEditedPost(post);
    }
    // Reset copied state when post changes
    setCopied(false);
    // Reset image when post changes
    setImageUrl(null);
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

  const handleGenerateImage = async () => {
    if (!editedPost) return;

    setIsGeneratingImage(true);
    try {
      // Call the image generation API
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: editedPost }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      toast({
        title: "Image Generated",
        description: "Your image has been successfully generated!"
      });
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: "Could not generate an image. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!post) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border border-border/50 shadow-soft min-h-[200px] flex items-center justify-center text-muted-foreground animate-slide-up">
        <CardContent className="p-6 text-center w-full">
          <p>Generate a post to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-lg transition-all duration-300 animate-slide-up">
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

        {/* Display generated image if available */}
        {imageUrl && (
          <div className="mt-4 max-w-full">
            <img 
              src={imageUrl} 
              alt="Generated based on post text" 
              className="max-w-full h-auto rounded-md shadow-md"
            />
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerateImage}
          disabled={isGeneratingImage || !editedPost}
          className="transition-all duration-300"
        >
          <Image className="h-4 w-4 mr-2" />
          {isGeneratingImage ? 'Generating...' : 'Generate Image'}
        </Button>
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
