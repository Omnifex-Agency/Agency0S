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
    User,
    Eye,
    EyeOff,
    Loader2,
    Lock,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export default function LoginForm() {
    const router = useRouter();
    const supabase = createClient();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isSettingUp, setIsSettingUp] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleAutoSetup = async () => {
        setIsSettingUp(true);
        setError(null);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: 'testclient@agency.os',
                password: 'Password123!',
                options: {
                    data: {
                        full_name: 'Test Client',
                        role: 'client'
                    }
                }
            });
            if (signUpError) throw signUpError;
            alert("Test account created successfully! You can now sign in.");
        } catch (err: any) {
            setError(err.message || "Setup failed. The user might already exist.");
        } finally {
            setIsSettingUp(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) throw signInError;

            // Determine role and redirect
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Special check for user: sakshimanoorkar@gmail.com
                if (user.email === 'sakshimanoorkar@gmail.com') {
                    console.log("Admin user detected: sakshimanoorkar@gmail.com");
                    router.push("/app");
                    router.refresh();
                    return;
                }

                const { data: member } = await supabase
                    .from('workspace_members')
                    .select('role')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (member && (member.role === 'admin' || member.role === 'owner')) {
                    router.push("/app");
                } else {
                    router.push("/client");
                }
            }
            router.refresh();
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-4xl mx-auto">
            {/* Login Form Card */}
            <Card className="border-none shadow-xl w-full max-w-md bg-white">
                <CardHeader className="flex flex-col items-center space-y-1.5 pb-2 pt-8">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex flex-col items-center text-center px-4 mt-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>
                        <p className="text-sm text-slate-500 font-medium italic">
                            Enter your credentials to access your portal.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-slate-200 focus:border-primary focus:ring-primary/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pr-10 border-slate-200 focus:border-primary focus:ring-primary/10"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 transition-colors"
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
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                                className="border-slate-300 rounded"
                            />
                            <label htmlFor="remember" className="text-xs text-slate-500 font-medium leading-none cursor-pointer">
                                Keep me signed in
                            </label>
                        </div>

                        {error && (
                            <div className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-lg border border-red-100 italic">
                                ⚠ {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : "Sign in to Dashboard"}
                        </Button>
                    </form>

                    <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-slate-100 after:h-px after:flex-1 after:bg-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Or continue with</span>
                    </div>

                    <Button variant="outline" type="button" className="w-full border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all h-11">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google Account
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-50 py-5 bg-slate-50/30 rounded-b-xl">
                    <p className="text-center text-sm text-slate-500 font-medium">
                        New to Agency OS?{" "}
                        <button
                            type="button"
                            onClick={() => router.push('/signup')}
                            className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all font-bold ml-1 active:scale-95"
                        >
                            Create an account
                        </button>
                    </p>
                </CardFooter>
            </Card>

            {/* Test User Info Card - Positioned to the side on desktop */}
            <div className="w-full max-w-xs lg:self-start lg:mt-12 space-y-4">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Demo Access</p>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Test Client Mode</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Username / Email</p>
                            <p className="text-xs font-mono text-slate-700 font-semibold break-all">testclient@agency.os</p>
                        </div>

                        <div className="space-y-1.5 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Secure Password</p>
                            <p className="text-xs font-mono text-slate-700 font-semibold">Password123!</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-dashed border-slate-200 space-y-3">
                        <p className="text-[11px] leading-relaxed text-slate-500 italic font-medium">
                            * Use these credentials to explore the client portal features instantly.
                        </p>
                        <Button
                            onClick={handleAutoSetup}
                            disabled={isSettingUp}
                            variant="outline"
                            className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-[11px] font-bold h-8 transition-all"
                        >
                            {isSettingUp ? "Creating Account..." : "✨ Quick Setup (One-Click)"}
                        </Button>
                    </div>
                </div>

                <div className="px-4 text-[11px] text-slate-400 text-center lg:text-left font-medium">
                    <p>© 2026 Agency OS. Secure Enterprise Authentication.</p>
                </div>
            </div>
        </div>
    );
}
