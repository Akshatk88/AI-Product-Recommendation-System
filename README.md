# AI Product Recommendation System

A minimal Next.js App Router app that recommends up to 3 products from a local catalog using OpenAI.

## Tech
- Next.js 14, React 18
- AI SDK with OpenAI provider (uses your `OPENAI_API_KEY`)
- Products stored in `public/products.json`

## Setup
1. Add your OpenAI key:
   - Create `.env.local` in the project root:
     \`\`\`
     OPENAI_API_KEY=your-openai-key
     \`\`\`
   - In v0 / Vercel Project Settings, add `OPENAI_API_KEY` to Environment Variables for deployment.
2. Run locally:
   - Install deps (the v0 preview infers from imports; in a local Next.js app run `npm install`).
   - `npm run dev`
3. Visit `http://localhost:3000`.

## Notes
- API route: `app/api/recommend/route.ts`
- Client form: `components/recommendation-form.tsx`
- Update products in `public/products.json`.
"# AI-Product-Recommendation-System" 
