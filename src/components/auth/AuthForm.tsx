"use client"

import * as React from "react"
import { useState, useId } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    view: "login" | "signup"
}

export function AuthForm({ view, className, ...props }: AuthFormProps) {
    const id = useId()
    const supabase = createClient()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (view === "signup") {
                const { error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: 'client' // Default role for signups
                        },
                    },
                })
                if (error) throw error
                router.push("/login?message=Check your email to confirm your account")
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                })
                if (signInError) throw signInError

                // After successful login, determine the role and redirect
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    // Check workspace_members for admin/owner roles
                    const { data: member } = await supabase
                        .from('workspace_members')
                        .select('role')
                        .eq('user_id', user.id)
                        .maybeSingle()

                    // If they are admin/owner in any workspace, they go to /app
                    if (member && (member.role === 'admin' || member.role === 'owner')) {
                        router.push("/app")
                    } else {
                        // Otherwise they are treated as clients
                        router.push("/client")
                    }
                }
                router.refresh()
            }
        } catch (err: any) {
            console.error("Auth error:", err)
            setError(err.message || "An error occurred during authentication")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-8 w-full max-w-[400px]", className)} {...props}>
            <div className="flex flex-col items-center gap-2">
                <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm"
                    aria-hidden="true"
                >
                    <svg
                        className="stroke-zinc-800 dark:stroke-zinc-100"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                    >
                        <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
                    </svg>
                </div>
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {view === "login" ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-sm text-slate-500 max-w-[280px]">
                        {view === "login"
                            ? "Enter your credentials to access your workspace"
                            : "Enter your details below to create your client account"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                    {view === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor={`${id}-name`}>Full Name</Label>
                            <Input
                                id={`${id}-name`}
                                placeholder="John Doe"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-email`}>Email</Label>
                        <Input
                            id={`${id}-email`}
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-password`}>Password</Label>
                        <Input
                            id={`${id}-password`}
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                </div>

                {view === "login" && (
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id={`${id}-remember`} />
                            <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                                Remember me
                            </Label>
                        </div>
                        <Link href="/forgot-password" title="Forgot Password" className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4">
                            Forgot password?
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 h-10" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        view === "login" ? "Sign in" : "Create account"
                    )}
                </Button>
            </form>

            <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Or</span>
            </div>

            <div className="space-y-3">
                <Button variant="outline" type="button" className="w-full h-10 border-slate-200">
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continue with Google
                </Button>

                <div className="text-center">
                    <Link
                        href={view === "login" ? "/signup" : "/login"}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        {view === "login"
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </Link>
                </div>
            </div>
        </div>
    )
}
