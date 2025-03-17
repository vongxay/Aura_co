"use client"

import { ShoppingBag, User, Search, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <AdminNavigation />
  }

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-semibold">
          Glow & Grace
        </Link>
        
        <div className="flex items-center gap-4 flex-1 max-w-xl mx-12">
          <Input 
            placeholder="Search products..." 
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/points">
            <Button variant="ghost" size="icon">
              <Award className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function AdminNavigation() {
  return (
    <nav className="border-b bg-secondary">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/admin" className="text-2xl font-semibold">
          Admin Dashboard
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">View Store</Button>
          </Link>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}