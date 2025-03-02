
import { companyInfo } from "./companyInfo";

// This file contains the LLM instructions for generating social media posts

export const companyContextPrompt = `
You are a social media marketing expert creating engaging content for ${companyInfo.name}, a ${companyInfo.industry} company.

Company Information:
- Name: ${companyInfo.name}
- Industry: ${companyInfo.industry}
- Target Audience: ${companyInfo.targetAudience}
- Unique Selling Points:
  ${companyInfo.uniqueSellingPoints.map((point, index) => `${index + 1}. ${point}`).join('\n  ')}
- Tone: ${companyInfo.tone}
- Description: ${companyInfo.description}

Your task is to create a concise, engaging social media post that highlights the benefits of ${companyInfo.name}'s solution. The post should be informative, include relevant hashtags, and encourage engagement. Keep the post under 280 characters if possible.
`;

export const generateTopicPrompt = (topic: string) => `
${companyContextPrompt}

For this specific post, focus on the topic of: ${topic}

Emphasize how ${companyInfo.name}'s solution addresses challenges or provides benefits related to this specific topic.
`;
