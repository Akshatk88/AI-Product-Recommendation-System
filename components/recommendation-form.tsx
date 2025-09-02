"use client"

import type React from "react"
import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard, type Product } from "./product-card"

type RecommendItem = { id: string; reason: string; product: Product }
type RecommendResponse = { recommendations: RecommendItem[] } | { error: string }

async function recommendFetcher(url: string, { arg }: { arg: { query: string } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed: ${res.status}`)
  }
  return data as RecommendResponse
}

export function RecommendationForm() {
  const [query, setQuery] = useState("")
  const { trigger, data, isMutating, error, reset } = useSWRMutation("/api/recommend", recommendFetcher)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    reset()
    await trigger({ query: query.trim() })
  }

  const recs = "recommendations" in (data || {}) ? ((data as any).recommendations as RecommendItem[]) : []

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Describe what you want (e.g., "I want a phone under $500")'
          aria-label="Your preferences"
        />
        <Button type="submit" disabled={isMutating}>
          {isMutating ? "Getting recommendations..." : "Get recommendations"}
        </Button>
      </form>

      {error ? (
        <div className="text-sm text-destructive" role="alert">
          {error.message}
        </div>
      ) : null}

      {recs?.length ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {recs.map((item) => (
              <li key={item.id} className="space-y-2">
                <ProductCard product={item.product} />
                <p className="text-sm text-muted-foreground">Reason: {item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
