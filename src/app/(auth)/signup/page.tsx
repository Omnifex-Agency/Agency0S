import Link from "next/link"
import { AuthForm } from "@/components/auth/AuthForm"
import { cn } from "@/lib/utils"

export const metadata = {
    title: "Create an account - Agency OS",
    description: "Create an account to get started",
}

export default function SignupPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </p>
            </div>
            <AuthForm view="signup" />
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Already have an account? Sign In
                </Link>
            </p>
        </div>
    )
}
