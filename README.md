# DEMO PROJECT: postgenius @ Fleete

**URL**: https://fleete-advertising.vercel.app/

## Overview
This is a demo of a website for internal use at Fleete, which allows users to generate engaging content for its social media pages. The content is generated using the OpenAI GPT API, which is fed context information about the company.

**Company context info includes:**
- name
- description
- industry
- target audience
- unique selling points
- solutions

The website has 3 central features:
- Generic post generation: a general post is created
- Topic-focused post generation: users can input a topic or a Fleete solution that the post should focus on
- News-focused post generation: users can select from a list of recent industry news/trends, which the post should incorporate

## Future work:
**Image generation:**
There are a few options for how this can be implemented.
- GenAI image generation: Based on the output post and/or the user query, the "generate image" button will generate an image that can be attached with the social media post. This could be done using OpenAI's api or Stability AI api, for example.
- Stock image fetching: If Fleete has a set of stock images that can be used, we can create a tool that automatically fetches relevant images for a post using RAG. We can tag each image with a vector embedding and a description (e.g. using CLIP), and then store these embeddings & descriptions and image IDs in a vector database to quickly find relevant images.

**LinkedIn:**
- Connection with LinkedIn or other social media API to schedule or manually post entries.
- Use LinkedIn API to gather engagement data about posts - this can be saved together with the records of past posts to provide insights to optimise future post generation.

**Other:**
- Storage of previously generated posts.
- Automatic daily search of industry news is set up to work - but requires for Vercel to be upgraded to a paid membership.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
