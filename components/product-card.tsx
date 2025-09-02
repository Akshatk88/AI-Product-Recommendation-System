import Image from "next/image"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  rating: number
  description: string
  image?: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4">
      <div className="flex items-start gap-4">
        <div className="size-20 relative rounded-md overflow-hidden bg-muted shrink-0">
          {/* decorative image */}
          <Image
            src={product.image || "/placeholder.svg?height=160&width=160&query=product%20image"}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {product.category} • ${product.price} • {product.rating.toFixed(1)}★
          </p>
          <p className="text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
