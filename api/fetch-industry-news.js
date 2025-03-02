
import { fetchIndustryNews } from '../src/utils/perplexityApi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'fleeteNewsData';

export default async function handler(req, res) {
  // Only allow scheduled jobs (GET) or fetching news for display (POST)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For scheduled jobs - fetch news and store in DynamoDB
    if (req.method === 'GET') {
      // Verify this is being called by the Vercel cron job
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
      if (!perplexityApiKey) {
        return res.status(500).json({ error: 'Missing Perplexity API key' });
      }

      // Fetch industry news from Perplexity
      const newsItems = await fetchIndustryNews(perplexityApiKey);
      
      // Store each news item in DynamoDB
      const timestamp = new Date().toISOString();
      const storePromises = newsItems.map(async (item) => {
        const params = {
          TableName: TABLE_NAME,
          Item: {
            newsID: `news_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            title: item.title,
            summary: item.summary,
            date: item.date || timestamp,
            source: item.source || 'Perplexity API',
            createdAt: timestamp,
          },
        };

        return docClient.send(new PutCommand(params));
      });

      await Promise.all(storePromises);
      return res.status(200).json({ success: true, count: newsItems.length });
    }
    
    // For client requests - return the latest news items
    else if (req.method === 'POST') {
      const params = {
        TableName: TABLE_NAME,
        // Using ScanCommand instead of QueryCommand since we're not using a GSI anymore
        Limit: 10,
      };

      const response = await docClient.send(new ScanCommand(params));
      
      // Sort the items by createdAt in descending order (newest first)
      const sortedItems = response.Items ? 
        [...response.Items].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10) : [];
      
      return res.status(200).json({ items: sortedItems });
    }
  } catch (error) {
    console.error('Error in industry news API:', error);
    return res.status(500).json({ error: error.message });
  }
}
