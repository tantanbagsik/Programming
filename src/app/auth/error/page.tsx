'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  OAuthSignin: 'Error in constructing an authorization URL.',
  OAuthCallback: 'Error in handling the response from an OAuth provider.',
  OAuthCreateAccount: 'Could not create OAuth provider account.',
  EmailCreateAccount: 'Could not create email provider account.',
  Callback: 'Error in the OAuth callback handler route.',
  OAuthAccountNotLinked: 'Email already in use with a different provider.',
  EmailSignin: 'The email could not be sent.',
  CredentialsSignin: 'Sign in failed. Check your credentials.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected error occurred.',
}

function ErrorContent() {
  const params = useSearchParams()
  const error = params.get('error') ?? 'Default'
  const message = errorMessages[error] ?? errorMessages.Default

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="glow-card p-10">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="font-sora font-bold text-2xl mb-3">Authentication Error</h1>
          <p className="text-gray-400 text-sm mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="btn-primary text-center">Try Again</Link>
            <Link href="/" className="btn-outline text-center">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-bg flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <ErrorContent />
    </Suspense>
  )
}
