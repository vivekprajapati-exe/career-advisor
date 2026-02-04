"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    LineChart,
    TrendingUp,
    DollarSign,
    Building2,
    Sparkles,
    Target,
    Briefcase,
} from "lucide-react";

export default function IndustryInsightsView({ insights, user }) {
    if (!insights) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Industry Insights</h1>
                    <p className="text-slate-400">Market trends and data for your industry</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                            <LineChart className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Industry Selected</h3>
                        <p className="text-slate-400 text-center max-w-md">
                            Complete your onboarding and select an industry to see personalized insights.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { salaryRanges } = insights;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Industry Insights</h1>
                    <p className="text-slate-400">Market trends and data for {insights.industry}</p>
                </div>
                <Badge variant="outline" className="w-fit border-blue-500/50 text-blue-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Last updated: {new Date(insights.lastUpdated).toLocaleDateString()}
                </Badge>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Demand Level</p>
                                <p className="text-2xl font-bold text-white">{insights.demandLevel}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${insights.demandLevel === "High" ? "bg-green-500/20" : "bg-yellow-500/20"
                                }`}>
                                <Target className={`h-6 w-6 ${insights.demandLevel === "High" ? "text-green-400" : "text-yellow-400"
                                    }`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Growth Rate</p>
                                <p className="text-2xl font-bold text-white">+{insights.growthRate}%</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Market Outlook</p>
                                <p className="text-2xl font-bold text-white">{insights.marketOutlook}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${insights.marketOutlook === "Positive" ? "bg-green-500/20" : "bg-yellow-500/20"
                                }`}>
                                <Briefcase className={`h-6 w-6 ${insights.marketOutlook === "Positive" ? "text-green-400" : "text-yellow-400"
                                    }`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Top Companies</p>
                                <p className="text-2xl font-bold text-white">{insights.topCompanies?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Ranges */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        Salary Ranges (USD/Year)
                    </CardTitle>
                    <CardDescription>Expected salary ranges by experience level</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {salaryRanges && (
                            <>
                                <SalaryBar
                                    label="Entry Level"
                                    min={salaryRanges.entry?.min || 40000}
                                    max={salaryRanges.entry?.max || 70000}
                                    color="blue"
                                />
                                <SalaryBar
                                    label="Mid Level"
                                    min={salaryRanges.mid?.min || 70000}
                                    max={salaryRanges.mid?.max || 120000}
                                    color="purple"
                                />
                                <SalaryBar
                                    label="Senior Level"
                                    min={salaryRanges.senior?.min || 120000}
                                    max={salaryRanges.senior?.max || 200000}
                                    color="green"
                                />
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Skills */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Top Skills in Demand</CardTitle>
                        <CardDescription>Most sought-after skills in {insights.industry}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {insights.topSkills?.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Emerging Skills */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Emerging Skills</CardTitle>
                        <CardDescription>Growing skills to learn for the future</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {insights.emergingSkills?.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Trends */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Key Industry Trends</CardTitle>
                    <CardDescription>Current trends shaping {insights.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights.keyTrends?.map((trend, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm text-slate-400">Trend #{index + 1}</span>
                                </div>
                                <p className="text-white">{trend}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Companies */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Top Companies Hiring</CardTitle>
                    <CardDescription>Leading employers in {insights.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {insights.topCompanies?.map((company) => (
                            <div
                                key={company}
                                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white"
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Outlook Summary */}
            {insights.outlookSummary && (
                <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Market Outlook Summary</h3>
                                <p className="text-slate-300">{insights.outlookSummary}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function SalaryBar({ label, min, max, color }) {
    const colorClasses = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        green: "bg-green-500",
    };

    const maxSalary = 250000; // For scaling
    const percentage = (max / maxSalary) * 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{label}</span>
                <span className="text-sm text-slate-400">
                    ${min.toLocaleString()} - ${max.toLocaleString()}
                </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]} rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
