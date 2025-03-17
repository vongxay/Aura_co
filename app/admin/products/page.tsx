"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import { Package, Pencil, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          image_url: editingProduct.image_url,
          stock_quantity: editingProduct.stock_quantity
        })
        .eq('id', editingProduct.id)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Success",
        description: "Product updated successfully"
      })
    } else {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: '',
          description: '',
          price: 0,
          image_url: '',
          stock_quantity: 0
        }])

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Success",
        description: "Product created successfully"
      })
    }

    setEditingProduct(null)
    fetchProducts()
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Success",
      description: "Product deleted successfully"
    })
    fetchProducts()
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button onClick={() => setEditingProduct({
          id: '',
          name: '',
          description: '',
          price: 0,
          image_url: '',
          stock_quantity: 0
        })}>
          Add Product
        </Button>
      </div>

      {editingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct.id ? 'Edit Product' : 'New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    image_url: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock_quantity}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    stock_quantity: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct.id ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">${product.price}</span>
                <span className="text-gray-600">Stock: {product.stock_quantity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}