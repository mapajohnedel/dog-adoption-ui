'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock auth - in production, would call actual auth service
    console.log(isLogin ? 'Login' : 'Register', { email, password, ...(isLogin ? {} : { name }) })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🐾</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Welcome Back' : 'Join PawMatch'}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Create an account to get started'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-secondary/10 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded transition-colors font-medium text-sm ${
                isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded transition-colors font-medium text-sm ${
                !isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-muted-foreground"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-muted-foreground"
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full border border-border text-foreground py-2 rounded-lg font-medium hover:bg-secondary/5 transition-colors flex items-center justify-center gap-2">
              <span>🔵</span>
              Google
            </button>
            <button className="w-full border border-border text-foreground py-2 rounded-lg font-medium hover:bg-secondary/5 transition-colors flex items-center justify-center gap-2">
              <span>👤</span>
              Facebook
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              {isLogin ? 'Register' : 'Sign in'}
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By {isLogin ? 'signing in' : 'registering'}, you agree to our{' '}
            <Link href="#" className="text-primary hover:opacity-80">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-primary hover:opacity-80">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
