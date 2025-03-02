
// This is a serverless function that will be deployed to Vercel
import { companyContextPrompt, generateTopicPrompt } from "../src/data/companyContext";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      companyName,
      companyDescription,
      industry,
      targetAudience,
      uniqueSellingPoints,
      tone,
      topic
    } = req.body;

    // Validate inputs
    if (!companyName || !industry || !targetAudience) {
      return res.status(400).json({ error: 'Missing required company information' });
    }

    // Access the environment variable
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Choose the appropriate prompt based on whether a topic was provided
    const prompt = topic 
      ? generateTopicPrompt(topic)
      : companyContextPrompt;

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a social media marketing expert that creates engaging content for businesses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return res.status(response.status).json({ 
        error: `API returned ${response.status}`, 
        details: errorData 
      });
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "Unable to generate post. Please try again.";

    return res.status(200).json({ post: generatedText });
  } catch (error) {
    console.error("Error generating post:", error);
    return res.status(500).json({ error: error.message || 'Failed to generate post' });
  }
}
