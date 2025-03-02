
interface PostGenerationParams {
  companyName: string;
  companyDescription: string;
  industry: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  tone: string;
  topic?: string;
}

export async function generatePost(params: PostGenerationParams): Promise<string> {
  // Call our serverless function
  try {
    const response = await fetch('/api/generate-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = `API returned ${response.status}: ${JSON.stringify(errorData)}`;
      } catch (e) {
        // If not JSON, use the raw text
        errorMessage = `API returned ${response.status}: ${errorText.substring(0, 100)}...`;
      }
      
      console.error("API error:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}
