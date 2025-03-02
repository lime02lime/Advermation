
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'fleeteNewsData';

export default async function handler(req, res) {
  // Only allow POST requests for fetching news
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if AWS credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are missing');
      return res.status(500).json({ 
        error: 'AWS credentials are missing. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.' 
      });
    }

    const params = {
      TableName: TABLE_NAME,
      Limit: 10,
    };

    const response = await docClient.send(new ScanCommand(params));
    
    // Sort the items by date in descending order (newest first)
    const sortedItems = response.Items ? 
      [...response.Items].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 10) : [];
    
    return res.status(200).json({ items: sortedItems });
  } catch (error) {
    console.error('Error in industry news API:', error);
    return res.status(500).json({ error: error.message });
  }
}
