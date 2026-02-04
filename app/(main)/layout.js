import { checkUser } from "@/actions/user";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";

export default async function MainLayout({ children }) {
    const user = await checkUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Redirect to onboarding if not completed
    if (!user.onboardingCompleted) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar user={user} />
            <div className="lg:pl-72">
                <Header user={user} />
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
