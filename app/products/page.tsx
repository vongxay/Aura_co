"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      })
      return
    }

    setProducts(data)
  }

  async function addToCart(productId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive"
      })
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: session.user.id,
          product_id: productId,
          quantity: 1
        }
      ])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Success",
      description: "Item added to cart"
    })
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-[200px]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">${product.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}