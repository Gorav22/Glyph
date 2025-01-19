'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthPageProps {
  onAuthenticated: (userId: string) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      if (isSignUp) {
        if (!isOtpSent) {
          // Request OTP
          const response = await fetch('/api/auth/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })
          if (response.ok) {
            setIsOtpSent(true)
          } else {
            const data = await response.json()
            setError(data.error || 'Failed to send OTP')
          }
        } else {
          // Verify OTP and sign up
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, otp })
          })
          if (response.ok) {
            const data = await response.json()
            onAuthenticated(data.userId)
          } else {
            const data = await response.json()
            setError(data.error || 'Sign up failed')
          }
        }
      } else {
        // Sign in
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        if (response.ok) {
          const data = await response.json()
          onAuthenticated(data.userId)
        } else {
          const data = await response.json()
          setError(data.error || 'Sign in failed')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create a new account to access the browser'
              : 'Sign in to your account to access the browser'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              {isSignUp && isOtpSent && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to your email"
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleSubmit}>
            {isSignUp
              ? isOtpSent
                ? 'Verify OTP and Sign Up'
                : 'Request OTP'
              : 'Sign In'}
          </Button>
          <p className="mt-4 text-sm text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <Button
              variant="link"
              className="p-0 ml-1"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

