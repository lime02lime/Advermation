
# DEMO PROJECT: postgenius @ ExampleCo

**URL**: https://advermation.vercel.app/

## Overview
This is a demo of a website for internal use at fictitious company ExampleCo, which allows users to generate engaging advertising content tailored to their business. The content is generated using the OpenAI GPT API, which is fed context information about the company, industry news, and user inputs.

**Company context info includes:**
- Name
- Description
- Industry
- Target audience
- Unique selling points
- Solutions

The website has 3 central features:
- **Automated Ad Generation**: Creates a general advertisement based on the company's unique aspects.
- **Topic-Focused Content**: Users can input a topic or select a specific company solution to tailor the ad.
- **News-Driven Content**: Users can incorporate industry trends and recent news into their ads.

## Future work:

**Image Generation:**
There are a few options for how this can be implemented:
- **AI-Generated Images**: Based on the generated ad and/or user input, an AI-generated image can be created using OpenAI's API or Stability AI.
- **Stock Image Fetching**: If ExampleCo has a stock image library, a tool can be developed to fetch relevant images using RAG. Images can be tagged with vector embeddings and descriptions (e.g., using CLIP) and stored in a vector database for efficient retrieval.

**Social Media Integration:**
- Connect with LinkedIn, Twitter, and other platforms for automated or scheduled posting.
- Use LinkedIn's API to gather engagement data, storing insights to optimize future ad generation.

**Additional Features:**
- Storage of previously generated ads for reference and reuse.
- Automated daily industry news scraping (requires upgrading Vercel to a paid membership).

## Technologies Used

This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
