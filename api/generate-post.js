
// This is a serverless function that will be deployed to Vercel
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

    // Build the prompt based on the same structure as companyContext.ts
    let prompt = `
    You are a social media marketing expert creating engaging content for ${companyName}, a ${industry} company.

    Company Information:
    - Name: ${companyName}
    - Industry: ${industry}
    - Target Audience: ${targetAudience}
    - Unique Selling Points:
      ${uniqueSellingPoints.map((point, index) => `${index + 1}. ${point}`).join('\n      ')}
    - Tone: ${tone}
    - Description: ${companyDescription}

    Your task is to create a concise, engaging social media post that highlights the benefits of ${companyName}'s solutions. The post should be informative, include relevant hashtags, and encourage engagement. Keep the post under 280 characters if possible.

    IMPORTANT: Use a few emojis throughout the post (around 4-5) to make it more engaging and eye-catching. Use emojis that relate to:
    - Electric vehicles and charging (⚡🔌🚙🔋🚐)
    - Environmental benefits (🌿🌱🌎♻️💚)
    - Business and fleet operations (📈💼🚚🔄⏱️)
    - Technology and innovation (💻📱📊🔍🤖)
    - Company success and forward reach (🔥🌟🚀🏆📈)

    Make sure to distribute the emojis naturally throughout the text. You can put them at the very beginning and/or after sentences (after the punctuation marks). The post should feel vibrant and modern with these visual elements.
    `;

    if (topic) {
      prompt += `\n\nFor this specific post, focus on the topic of: ${topic}

      Emphasize how ${companyName}'s solution addresses challenges or provides benefits related to this specific topic.
      
      Be sure to mention which specific solution from our offerings (Charging Hubs, Depot Electrification, or Software Platform) best relates to this topic.
      
      Remember to include PLENTY of emojis (at least 4-5) that specifically relate to this topic as well as fleet electrification in general. Make the post visually engaging and fun to read with these emojis distributed throughout the text.`;
    }

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
      const errorData = await response.text();
      let errorMessage;
      
      try {
        const jsonError = JSON.parse(errorData);
        errorMessage = JSON.stringify(jsonError);
      } catch (e) {
        errorMessage = errorData.substring(0, 200);
      }
      
      console.error("Groq API error:", errorMessage);
      return res.status(response.status).json({ 
        error: `API returned ${response.status}`, 
        details: errorMessage 
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
