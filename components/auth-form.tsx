import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthFormProps {
  onAuthenticated: () => void
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, email, password, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred')
      }

      if (mode === 'signup') {
        setMode('verify')
      } else if (mode === 'verify' || mode === 'signin') {
        onAuthenticated()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Verify OTP'}</CardTitle>
        <CardDescription>
          {mode === 'signin' ? 'Enter your credentials to sign in' : 
           mode === 'signup' ? 'Create a new account' : 
           'Enter the OTP sent to your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'verify' && (
            <>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}
          {mode === 'verify' && (
            <Input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
          <Button type="submit" className="w-full">
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Verify'}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter>
        {mode === 'signin' ? (
          <Button variant="link" onClick={() => setMode('signup')}>
            Don't have an account? Sign up
          </Button>
        ) : mode === 'signup' ? (
          <Button variant="link" onClick={() => setMode('signin')}>
            Already have an account? Sign in
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

