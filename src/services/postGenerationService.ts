import Groq from "groq";
import { companyContextPrompt, generateTopicPrompt } from "@/data/companyContext";

interface PostGenerationParams {
  companyName: string;
  companyDescription: string;
  industry: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  tone: string;
  topic?: string;
}

// Initialize the Groq client
// Note: Users will need to set their API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "your-groq-api-key", // Replace with actual API key
});

export async function generatePost(params: PostGenerationParams): Promise<string> {
  try {
    // If no API key is provided, fall back to mock data
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your-groq-api-key") {
      console.warn("No Groq API key provided. Using mock data instead.");
      return generateMockPost(params);
    }

    const prompt = params.topic 
      ? generateTopicPrompt(params.topic)
      : companyContextPrompt;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a social media marketing expert that creates engaging content for businesses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "Unable to generate post. Please try again.";
  } catch (error) {
    console.error("Error generating post with Groq:", error);
    return generateMockPost(params);
  }
}

// Fallback function for mock post generation (kept for offline use or when API fails)
function generateMockPost(params: PostGenerationParams): string {
  if (params.topic) {
    return generateTopicBasedPost(params);
  } else {
    return generateGenericPost(params);
  }
}

// Simulate a generic post generation
function generateGenericPost(params: PostGenerationParams): string {
  const { companyName, uniqueSellingPoints, tone, targetAudience } = params;
  
  // Select 1-2 random selling points
  const randomSellingPoints = uniqueSellingPoints
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 1);
  
  const posts = [
    `Looking to optimize your fleet's performance? ${companyName} delivers cutting-edge solutions that ${randomSellingPoints[0].toLowerCase()}. Our clients see an average of 27% reduction in operational costs within the first 3 months. #FleetManagement #BusinessEfficiency`,
    
    `Did you know? Inefficient fleet management costs businesses thousands annually. At ${companyName}, we're changing that with technology that ${randomSellingPoints[0].toLowerCase()}. Schedule your demo today! #FleetTech #CostReduction`,
    
    `${companyName} is transforming how businesses manage their fleets. With our intuitive dashboard, you'll gain insights that ${randomSellingPoints[0].toLowerCase()}. What could your business achieve with optimized fleet operations? #BusinessGrowth #FleetManagement`,
    
    `Success story: A client reduced their fuel costs by 31% after implementing ${companyName}'s technology. Our solution ${randomSellingPoints[0].toLowerCase()} while providing real-time analytics you can actually use. #BusinessSuccess #FleetOptimization`,
    
    `Fleet management shouldn't be complicated. ${companyName} provides seamless integration that ${randomSellingPoints[0].toLowerCase()}. Discover how we're different from traditional solutions. #Innovation #FleetTech`
  ];
  
  // Select a random post from the array
  return posts[Math.floor(Math.random() * posts.length)];
}

// Simulate a topic-based post generation
function generateTopicBasedPost(params: PostGenerationParams): string {
  const { companyName, topic, targetAudience, uniqueSellingPoints } = params;
  
  // Select a random selling point
  const randomSellingPoint = uniqueSellingPoints[Math.floor(Math.random() * uniqueSellingPoints.length)];
  
  if (topic?.toLowerCase().includes('fuel') || topic?.toLowerCase().includes('gas')) {
    return `Fuel costs eating into your profits? ${companyName}'s intelligent fuel management system helps fleet operators save up to 25% on fuel expenses. Our technology ${randomSellingPoint.toLowerCase()}, ensuring your vehicles run at optimal efficiency. #FuelSavings #FleetManagement`;
  }
  
  if (topic?.toLowerCase().includes('maintenance') || topic?.toLowerCase().includes('repair')) {
    return `Unexpected maintenance issues can derail your operations. ${companyName}'s predictive maintenance features identify potential problems before they become costly repairs. Our system ${randomSellingPoint.toLowerCase()}, keeping your fleet on the road longer. #FleetMaintenance #PreventiveService`;
  }
  
  if (topic?.toLowerCase().includes('safety') || topic?.toLowerCase().includes('driver')) {
    return `Driver safety is a top priority for every fleet manager. ${companyName}'s driver behavior monitoring tools help improve safety metrics while reducing liability. Our solution ${randomSellingPoint.toLowerCase()}, creating a culture of safety across your organization. #DriverSafety #FleetManagement`;
  }
  
  // Generic topic-based post
  return `${topic} is a key consideration for modern fleet operations. At ${companyName}, we address this through innovative technology that ${randomSellingPoint.toLowerCase()}. Our clients in the ${params.industry} sector report significant improvements after implementing our solutions. #${topic?.replace(/\s+/g, '')} #FleetTechnology`;
}
