"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, CheckCircle2 } from "lucide-react"

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) throw error

            setSuccess(true)

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className={cn("grid gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-4 rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                    <div className="space-y-2">
                        <h3 className="font-semibold">Password updated!</h3>
                        <p className="text-sm text-muted-foreground">
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            placeholder="Enter new password"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update password
                    </Button>
                </div>
            </form>
        </div>
    )
}
