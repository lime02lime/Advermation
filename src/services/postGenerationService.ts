
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
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}
