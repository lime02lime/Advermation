
// This file serves as a template for setting up a real AWS DynamoDB integration
// It's not used in the demo version, but shows how to implement it in production

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const configureDynamoClient = () => {
  // Check for required environment variables
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    throw new Error(
      'Missing AWS credentials. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION environment variables.'
    );
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return DynamoDBDocumentClient.from(client);
};

const TABLE_NAME = 'fleeteNewsData'; // Table must exist in your DynamoDB account

export default async function handler(req, res) {
  // Only allow POST requests for fetching news
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Setup DynamoDB client
    const docClient = configureDynamoClient();

    // Scan the table for news items
    const params = {
      TableName: TABLE_NAME,
      Limit: 10, // Only get the latest 10 items
    };

    const response = await docClient.send(new ScanCommand(params));
    
    // Sort items by date (newest first)
    const sortedItems = response.Items ? 
      [...response.Items].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ) : [];
    
    return res.status(200).json({ 
      items: sortedItems,
      message: 'Successfully retrieved news items'
    });
  } catch (error) {
    console.error('Error in industry news API:', error);
    
    // Return detailed error information for debugging
    return res.status(500).json({ 
      error: error.message,
      details: error.stack,
      suggestions: [
        'Make sure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION are set',
        'Verify the DynamoDB table "fleeteNewsData" exists',
        'Check that your AWS IAM user has permission to scan the table'
      ]
    });
  }
}
