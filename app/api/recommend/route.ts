import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

const BodySchema = z.object({
  query: z.string().min(1, "Query is required"),
})

type Product = {
  id: string
  name: string
  category: string
  price: number
  rating: number
  description: string
  image?: string
}

const RecSchema = z.object({
  recommendations: z
    .array(
      z.object({
        id: z.string(),
        reason: z.string().min(1),
      }),
    )
    .max(3),
})

async function getProducts(): Promise<Product[]> {
  const file = path.join(process.cwd(), "public", "products.json")
  const raw = await fs.readFile(file, "utf8")
  return JSON.parse(raw) as Product[]
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Add it in Project Settings or .env.local for local dev." },
        { status: 500 },
      )
    }

    const json = await req.json().catch(() => ({}))
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    const { query } = parsed.data
    const products = await getProducts()

    const productSummaries = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      description: p.description,
    }))

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: RecSchema,
      system:
        "You are a helpful product recommender. Select up to 3 products that best match the user's request. " +
        "Prioritize exact constraints (like budget) and clear preferences. Provide a concise reason for each pick.",
      prompt:
        `User request: ${query}\n\n` +
        "Here is the product catalog as JSON array of objects with fields id, name, category, price, rating, description:\n" +
        JSON.stringify(productSummaries),
    })

    const selected = (object.recommendations || [])
      .slice(0, 3)
      .map((rec) => {
        const product = products.find((p) => p.id === rec.id)
        return product ? { ...rec, product } : null
      })
      .filter(Boolean)

    return NextResponse.json({ recommendations: selected })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}
