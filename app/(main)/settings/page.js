import { getUserProfile } from "@/actions/user";
import SettingsPage from "@/components/settings/settings-page";

export default async function Settings() {
    const user = await getUserProfile();
    return <SettingsPage user={user} />;
}
