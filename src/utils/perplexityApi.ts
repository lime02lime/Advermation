
/**
 * Utility functions for interacting with the Perplexity API
 */

/**
 * Fetches industry news using the Perplexity API
 * @param apiKey - The Perplexity API key
 * @param query - The search query for industry news
 * @returns The search results
 */
export async function fetchIndustryNews(apiKey: string, query: string = "latest fleet electrification industry news") {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that provides the latest news about fleet electrification and EV industry. 
            Format your response as JSON array with objects containing:
            - title: News title
            - summary: Brief summary of the news in 2-3 sentences
            - date: ISO date string of when the news was published
            - source: Source publication name
            - sourceLink: URL to the original news source`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: [],
        search_recency_filter: 'week',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract and parse the JSON array from the response
    try {
      const contentString = data.choices[0].message.content;
      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = contentString.match(/\[\s*\{.*\}\s*\]/s);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // If we can't find JSON array pattern, try to parse the whole content
        return JSON.parse(contentString);
      }
    } catch (parseError) {
      console.error("Failed to parse Perplexity response as JSON:", parseError);
      return {
        error: "Failed to parse response",
        rawContent: data.choices[0].message.content
      };
    }
  } catch (error) {
    console.error("Error fetching industry news:", error);
    throw error;
  }
}
