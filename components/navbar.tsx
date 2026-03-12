'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-border shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🐾</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              PawMatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Browse Dogs
            </Link>
            <Link href="#about" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth" className="text-foreground hover:text-primary transition-colors text-sm font-medium px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/browse" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary/20 transition-colors">
                Browse Dogs
              </Link>
              <Link href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary/20 transition-colors">
                About
              </Link>
              <Link href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary/20 transition-colors">
                Contact
              </Link>
              <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary/20 transition-colors">
                Sign In
              </Link>
              <Link href="/auth" className="block w-full mt-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-base font-medium text-center hover:opacity-90 transition-opacity">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
