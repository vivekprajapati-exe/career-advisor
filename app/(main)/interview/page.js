import { Suspense } from "react";
import { getSessionHistory } from "@/actions/interview";
import { getUserProfile } from "@/actions/user";
import InterviewPrep from "@/components/interview/interview-prep";
import { Skeleton } from "@/components/ui/skeleton";

export default async function InterviewPage() {
    const [sessions, user] = await Promise.all([
        getSessionHistory(),
        getUserProfile(),
    ]);

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <InterviewPrep sessions={sessions} user={user} />
        </Suspense>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48 bg-slate-800" />
            <Skeleton className="h-[400px] bg-slate-800" />
        </div>
    );
}
