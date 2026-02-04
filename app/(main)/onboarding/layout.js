import { checkUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }) {
    const user = await checkUser();

    if (!user) {
        redirect("/sign-in");
    }

    // If already completed onboarding, go to dashboard
    if (user.onboardingCompleted) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
        </div>
    );
}
