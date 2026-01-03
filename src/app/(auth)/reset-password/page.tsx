import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export const metadata = {
    title: "Reset Password - Agency OS",
    description: "Set your new password",
}

export default function ResetPasswordPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Set new password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>
            <ResetPasswordForm />
        </div>
    )
}
