import { getIndustryInsights } from "@/actions/industry";
import { getUserProfile } from "@/actions/user";
import IndustryInsightsView from "@/components/insights/industry-insights";

export default async function InsightsPage() {
    const user = await getUserProfile();

    let insights = null;
    if (user?.industry) {
        insights = await getIndustryInsights(user.industry).catch(() => null);
    }

    return <IndustryInsightsView insights={insights} user={user} />;
}
