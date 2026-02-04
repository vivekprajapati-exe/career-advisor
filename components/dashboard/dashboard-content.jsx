"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    FileText,
    Mail,
    Briefcase,
    LineChart,
    TrendingUp,
    Target,
    Sparkles,
    ArrowRight,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const quickActions = [
    {
        title: "Build Resume",
        description: "Create or edit your professional resume",
        icon: FileText,
        href: "/resume",
        color: "from-blue-600 to-blue-400",
    },
    {
        title: "Cover Letter",
        description: "Generate a tailored cover letter",
        icon: Mail,
        href: "/cover-letter",
        color: "from-purple-600 to-purple-400",
    },
    {
        title: "Interview Prep",
        description: "Practice with AI-generated questions",
        icon: Briefcase,
        href: "/interview",
        color: "from-green-600 to-green-400",
    },
    {
        title: "Industry Insights",
        description: "View market trends and salary data",
        icon: LineChart,
        href: "/insights",
        color: "from-orange-600 to-orange-400",
    },
];

export default function DashboardContent({ user, recommendations }) {
    const industryInsights = recommendations?.industryInsights;
    const skillAnalysis = recommendations?.skillAnalysis;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Ready to take the next step in your career journey?
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className="w-fit border-blue-500/50 text-blue-300"
                >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {user?.industry || "Explorer"}
                </Badge>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group h-full">
                            <CardContent className="p-6">
                                <div
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <action.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">{action.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Completion */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Target className="h-5 w-5 text-blue-400" />
                            Profile Completion
                        </CardTitle>
                        <CardDescription>Your career profile status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-white font-medium">
                                    {calculateProfileCompletion(user)}%
                                </span>
                            </div>
                            <Progress value={calculateProfileCompletion(user)} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            {getProfileChecklist(user).map((item) => (
                                <div key={item.label} className="flex items-center gap-2 text-sm">
                                    {item.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                    )}
                                    <span className={item.completed ? "text-slate-400" : "text-white"}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Skill Match */}
                {skillAnalysis && (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                Skill Match
                            </CardTitle>
                            <CardDescription>
                                How your skills match {user?.industry || "industry"} demands
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-slate-700"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={`${skillAnalysis.skillMatch * 3.52} 352`}
                                            className="text-green-500"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                                        {skillAnalysis.skillMatch}%
                                    </span>
                                </div>
                            </div>
                            {skillAnalysis.missingSkills?.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-400 mb-2">Skills to learn:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {skillAnalysis.missingSkills.slice(0, 3).map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-xs border-orange-500/50 text-orange-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Industry Outlook */}
                {industryInsights && (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <LineChart className="h-5 w-5 text-purple-400" />
                                Industry Outlook
                            </CardTitle>
                            <CardDescription>{user?.industry || "Your Industry"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Demand Level</span>
                                <Badge
                                    className={
                                        industryInsights.demandLevel === "High"
                                            ? "bg-green-500/20 text-green-300"
                                            : industryInsights.demandLevel === "Medium"
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-red-500/20 text-red-300"
                                    }
                                >
                                    {industryInsights.demandLevel}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Growth Rate</span>
                                <span className="text-white font-medium">
                                    +{industryInsights.growthRate}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Market Outlook</span>
                                <Badge
                                    className={
                                        industryInsights.marketOutlook === "Positive"
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-yellow-500/20 text-yellow-300"
                                    }
                                >
                                    {industryInsights.marketOutlook}
                                </Badge>
                            </div>
                            <Link href="/insights">
                                <Button variant="ghost" className="w-full mt-2 text-blue-400 hover:text-blue-300">
                                    View Full Insights
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Top Skills in Demand */}
            {industryInsights?.topSkills && (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Top Skills in Demand</CardTitle>
                        <CardDescription>
                            Most sought-after skills in {user?.industry || "your industry"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {industryInsights.topSkills.map((skill) => {
                                const hasSkill = user?.skills?.some(
                                    (s) => s.toLowerCase() === skill.toLowerCase()
                                );
                                return (
                                    <Badge
                                        key={skill}
                                        variant={hasSkill ? "default" : "outline"}
                                        className={
                                            hasSkill
                                                ? "bg-green-500/20 text-green-300 border-green-500/50"
                                                : "border-slate-600 text-slate-400"
                                        }
                                    >
                                        {hasSkill && <CheckCircle className="h-3 w-3 mr-1" />}
                                        {skill}
                                    </Badge>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function calculateProfileCompletion(user) {
    if (!user) return 0;
    const fields = [
        user.name,
        user.industry,
        user.currentRole,
        user.experience !== null,
        user.skills?.length > 0,
        user.bio,
        user.targetRoles?.length > 0,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
}

function getProfileChecklist(user) {
    return [
        { label: "Basic info", completed: !!user?.name },
        { label: "Industry selected", completed: !!user?.industry },
        { label: "Current role", completed: !!user?.currentRole },
        { label: "Skills added", completed: user?.skills?.length > 0 },
        { label: "Bio written", completed: !!user?.bio },
    ];
}
