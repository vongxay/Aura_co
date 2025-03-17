"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'
import Image from "next/image"
import { Trash2 } from 'lucide-react'

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    image_url: string
  }
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchCartItems()
  }, [])

  async function fetchCartItems() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      toast({
        title: "Please sign in",
        description: "Failed to fetch cart items",
        variant: "destructive"
      })
      return
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', session.user.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive"
      })
      return
    }

    setCartItems(data)
  }

  async function removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      })
      return
    }

    setCartItems(cartItems.filter(item => item.id !== cartItemId))
    toast({
      title: "Success",
      description: "Item removed from cart"
    })
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold">${item.product.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}