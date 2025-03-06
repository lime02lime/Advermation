
// This endpoint calls the Perplexity API to search for recent news and saves results to DynamoDB
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'fleeteNewsData';

export default async function handler(req, res) {
  try {
    // Accept both GET (for cron) and POST requests
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Default query for automated cron runs
    const defaultQuery = "latest news in delivery, transport and electric vehicles industry";
    
    // Use the provided query for POST requests or the default for GET (cron) requests
    const query = req.method === 'POST' && req.body && req.body.query 
      ? req.body.query 
      : defaultQuery;
    
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    if (!PERPLEXITY_API_KEY) {
      return res.status(500).json({ 
        error: 'Perplexity API key not configured. Please add PERPLEXITY_API_KEY to your environment variables.' 
      });
    }

    // Check if AWS credentials are available for saving to DynamoDB
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are missing for DynamoDB operations');
      return res.status(500).json({ 
        error: 'AWS credentials are missing. Cannot save to DynamoDB.' 
      });
    }

    console.log(`Searching for news with Perplexity API using query: ${query}`);

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
                "summary": "Brief summary of the news in 2-3 sentences",
                "date": "ISO date string of when the news was published",
                "source": "Source publication name",
                "sourceLink": "URL to the original news source"
              }
            ]
            Provide exactly 5 news items. Each news item must include all fields. Make sure the summary is 2-3 sentences long.
            The date should be the actual publication date of the news article.
            The sourceLink should be a valid URL to the original news source if available.`
          },
          {
            role: 'user',
            content: `Find the latest news and trends in delivery, transport and transport electrification from the past 24 hours if possible. 
            Focus on major developments, innovations, and industry announcements.
            Format your response strictly as JSON that can be parsed directly.
            Make sure to include source links for each news item if available.`
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
      
      // Add dateAdded field and ensure each item has a newsID
      const now = new Date().toISOString();
      newsItems = newsItems.map(item => ({
        ...item,
        newsID: item.newsID || uuidv4(),
        dateAdded: now
      }));

      // Save each news item to DynamoDB
      console.log('Saving news items to DynamoDB...');
      const savePromises = newsItems.map(async (item) => {
        try {
          await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item
          }));
          console.log(`Saved item ${item.newsID} to DynamoDB`);
          return true;
        } catch (err) {
          console.error(`Failed to save item ${item.newsID} to DynamoDB:`, err);
          return false;
        }
      });

      const saveResults = await Promise.all(savePromises);
      const savedCount = saveResults.filter(result => result).length;
      
      console.log(`Saved ${savedCount} of ${newsItems.length} items to DynamoDB`);
      
      // Return both the news items and save status
      return res.status(200).json({ 
        items: newsItems,
        saved: savedCount > 0,
        savedCount 
      });
    } catch (error) {
      console.error('Error parsing Perplexity response as JSON:', error);
      return res.status(500).json({ 
        error: 'Failed to parse news data from Perplexity API',
        content: content
      });
    }
  } catch (error) {
    console.error('Error in search-industry-news API:', error);
    return res.status(500).json({ error: 'Failed to search for industry news: ' + error.message });
  }
}
