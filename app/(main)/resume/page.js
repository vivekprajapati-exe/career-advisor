import { Suspense } from "react";
import { listResumes } from "@/actions/resume";
import { getUserProfile } from "@/actions/user";
import ResumeBuilder from "@/components/resume/resume-builder";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ResumePage() {
    const [resumes, user] = await Promise.all([
        listResumes(),
        getUserProfile(),
    ]);

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <ResumeBuilder resumes={resumes} user={user} />
        </Suspense>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48 bg-slate-800" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[600px] bg-slate-800" />
                <Skeleton className="h-[600px] bg-slate-800" />
            </div>
        </div>
    );
}
