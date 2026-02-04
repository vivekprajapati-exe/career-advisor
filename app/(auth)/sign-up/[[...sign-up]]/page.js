import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary:
                            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                        card: "bg-slate-800/50 backdrop-blur-lg border border-slate-700",
                        headerTitle: "text-white",
                        headerSubtitle: "text-slate-400",
                        socialButtonsBlockButton:
                            "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                        formFieldLabel: "text-slate-300",
                        formFieldInput:
                            "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400",
                        footerActionLink: "text-blue-400 hover:text-blue-300",
                    },
                }}
            />
        </div>
    );
}
