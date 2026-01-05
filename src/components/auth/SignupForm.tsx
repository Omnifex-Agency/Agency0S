"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    Shield,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export default function SignupForm() {
    const router = useRouter();
    const supabase = createClient();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [role, setRole] = useState("client");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeTerms) {
            setError("Please agree to the terms and conditions");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const finalRole = email.trim().toLowerCase() === 'sakshimanoorkar@gmail.com' ? 'admin' : role;

            const { error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                        role: finalRole // Force admin for sakshimanoorkar@gmail.com
                    },
                },
            });

            if (signUpError) throw signUpError;

            // Successfully signed up
            router.push("/login?message=Check your email to confirm your account");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                    <User className="h-5 w-5 text-foreground" />
                </div>
                <div className="space-y-0.5 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Create an account
                    </h2>
                    <p className="text-muted-foreground text-center">
                        Welcome! Create an account to get started.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger
                                id="role"
                                className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
                            >
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="client">
                                    <div className="flex items-center gap-2">
                                        <User size={16} aria-hidden="true" className="text-muted-foreground" />
                                        <span>Agency Client</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} aria-hidden="true" className="text-muted-foreground" />
                                        <span>Workspace Admin</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreeTerms}
                            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                        />
                        <label htmlFor="terms" className="text-xs text-muted-foreground leading-none">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline font-medium">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline font-medium">
                                Conditions
                            </a>
                        </label>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 font-medium">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t py-4">
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
