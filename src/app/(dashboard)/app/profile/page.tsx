"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const { user, email, fullName, avatarUrl, loading: userLoading } = useUser()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/login")
        }
    }, [user, userLoading, router])

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: fullName || "",
                email: email || "",
            })
        }
    }, [user, fullName, email])

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.fullName,
                }
            })

            if (error) throw error

            toast.success("Profile updated successfully!")
        } catch (error: any) {
            console.error("Error updating profile:", error)
            toast.error(error.message || "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    const getInitials = () => {
        if (formData.fullName) {
            return formData.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        if (formData.email) {
            return formData.email[0].toUpperCase()
        }
        return 'U'
    }

    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your personal information and preferences
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Picture Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>
                            Your profile picture is synced with your authentication provider
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl || undefined} alt={formData.fullName || formData.email} />
                                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-muted-foreground">
                                <p>Avatar is managed by your authentication provider.</p>
                                <p className="mt-1">User ID: <span className="font-mono text-xs">{user.id}</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed from this page
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            Read-only account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Account Created</Label>
                                <p className="text-sm font-medium mt-1">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Last Sign In</Label>
                                <p className="text-sm font-medium mt-1">
                                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Email Confirmed</Label>
                                <p className="text-sm font-medium mt-1">
                                    {user.email_confirmed_at ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Provider</Label>
                                <p className="text-sm font-medium mt-1 capitalize">
                                    {user.app_metadata?.provider || 'Email'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
