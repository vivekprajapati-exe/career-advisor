import { getUserProfile } from "@/actions/user";
import { getPersonalizedRecommendations } from "@/actions/industry";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
    const user = await getUserProfile();
    const recommendations = await getPersonalizedRecommendations().catch(() => null);

    return <DashboardContent user={user} recommendations={recommendations} />;
}
