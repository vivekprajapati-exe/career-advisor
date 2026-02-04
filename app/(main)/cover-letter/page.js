import { Suspense } from "react";
import { listCoverLetters } from "@/actions/cover-letter";
import { getUserProfile } from "@/actions/user";
import CoverLetterGenerator from "@/components/cover-letter/cover-letter-generator";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CoverLetterPage() {
    const [coverLetters, user] = await Promise.all([
        listCoverLetters(),
        getUserProfile(),
    ]);

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <CoverLetterGenerator coverLetters={coverLetters} user={user} />
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
