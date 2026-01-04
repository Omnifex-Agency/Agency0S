import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import Link from "next/link"

export const metadata = {
    title: "Forgot Password - Agency OS",
    description: "Reset your password",
}

export default function ForgotPasswordPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Reset your password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a link to reset your password
                </p>
            </div>
            <ForgotPasswordForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Back to login
                </Link>
            </p>
        </div>
    )
}
