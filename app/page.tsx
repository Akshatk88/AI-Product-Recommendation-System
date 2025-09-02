import { promises as fs } from "fs"
import path from "path"
import { RecommendationForm } from "@/components/recommendation-form"
import { ProductCard, type Product } from "@/components/product-card"

async function getProducts(): Promise<Product[]> {
  const file = path.join(process.cwd(), "public", "products.json")
  const raw = await fs.readFile(file, "utf8")
  return JSON.parse(raw)
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-balance">AI Product Recommendation System</h1>
        <p className="text-muted-foreground text-pretty">
          Describe what you’re looking for and get up to three AI-picked products from our catalog.
        </p>
      </header>

      <section aria-labelledby="recommendation-form" className="space-y-4">
        <h2 id="recommendation-form" className="sr-only">
          Recommendation form
        </h2>
        <RecommendationForm />
      </section>

      <section aria-labelledby="catalog" className="space-y-4">
        <h2 id="catalog" className="text-lg font-semibold">
          Catalog
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
