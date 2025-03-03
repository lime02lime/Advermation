
// This endpoint calls the Perplexity API to search for recent news on transport electrification
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    if (!PERPLEXITY_API_KEY) {
      return res.status(500).json({ 
        error: 'Perplexity API key not configured. Please add PERPLEXITY_API_KEY to your environment variables.' 
      });
    }

    console.log('Searching for news with Perplexity API using query:', query);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that provides the latest news about transportation, delivery, and electric vehicles. 
            Format your response as JSON that matches this structure:
            [
              {
                "newsID": "unique-id",
                "title": "News title",
                "summary": "Brief summary of the news",
                "date": "ISO date string",
                "source": "Source publication name"
              }
            ]
            Provide exactly 5 news items. Each news item must include all fields.`
          },
          {
            role: 'user',
            content: `Find the latest news and trends in delivery, transport and transport electrification. 
            Focus on major developments, innovations, and industry announcements.
            Format your response strictly as JSON that can be parsed directly.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_search_results: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return res.status(response.status).json({ 
        error: `Perplexity API returned an error: ${response.status} ${response.statusText}` 
      });
    }

    const data = await response.json();
    console.log('Perplexity API response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      return res.status(500).json({ error: 'Invalid response from Perplexity API' });
    }

    // The content from Perplexity might be JSON string or might include markdown code blocks
    let content = data.choices[0].message.content;
    
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      content = jsonMatch[1];
    }

    let newsItems;
    try {
      // Parse the content as JSON
      newsItems = JSON.parse(content);
      
      // Ensure each item has a newsID
      newsItems = newsItems.map(item => ({
        ...item,
        newsID: item.newsID || uuidv4()
      }));
    } catch (error) {
      console.error('Error parsing Perplexity response as JSON:', error);
      return res.status(500).json({ 
        error: 'Failed to parse news data from Perplexity API',
        content: content
      });
    }

    return res.status(200).json({ items: newsItems });
  } catch (error) {
    console.error('Error in search-industry-news API:', error);
    return res.status(500).json({ error: 'Failed to search for industry news: ' + error.message });
  }
}
