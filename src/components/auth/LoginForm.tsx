"use client"

import { useActionState } from "react"
import { authenticate } from "@/app/login/actions"
import { AlertCircle, ArrowRight } from "lucide-react"

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="email">
              E-posta Adresi
            </label>
            <input
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all pr-10"
              id="email"
              type="email"
              name="email"
              placeholder="admin@nexuserp.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="password">
              Şifre
            </label>
            <input
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all pr-10"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>
        
        <button
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary h-11 px-8 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          type="submit"
          aria-disabled={isPending}
        >
          {isPending ? "Giriş Yapılıyor..." : (
            <>
              Sisteme Giriş Yap
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>

        {errorMessage && (
          <div className="flex items-center space-x-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20" aria-live="polite" aria-atomic="true">
            <AlertCircle className="h-5 w-5" />
            <p>{errorMessage}</p>
          </div>
        )}
      </form>
    </div>
  )
}
