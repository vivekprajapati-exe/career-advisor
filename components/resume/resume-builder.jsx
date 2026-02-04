"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Sparkles, Download, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export default function ResumeBuilder({ resumes, user }) {
    const [selectedResume, setSelectedResume] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
                    <p className="text-slate-400">Create and manage your professional resumes</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Resume
                </Button>
            </div>

            {/* Resume List */}
            {resumes?.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Resumes Yet</h3>
                        <p className="text-slate-400 text-center max-w-md mb-6">
                            Create your first AI-powered resume to start applying for jobs with confidence.
                        </p>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Create Your First Resume
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes?.map((resume) => (
                        <Card
                            key={resume.id}
                            className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-white text-lg">{resume.title}</CardTitle>
                                        <CardDescription>
                                            Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                                        </CardDescription>
                                    </div>
                                    {resume.isPrimary && (
                                        <Badge className="bg-green-500/20 text-green-300">Primary</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {resume.atsScore && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-slate-400">ATS Score:</span>
                                        <Badge
                                            className={
                                                resume.atsScore >= 80
                                                    ? "bg-green-500/20 text-green-300"
                                                    : resume.atsScore >= 60
                                                        ? "bg-yellow-500/20 text-yellow-300"
                                                        : "bg-red-500/20 text-red-300"
                                            }
                                        >
                                            {resume.atsScore}%
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1 border-slate-600">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-slate-600">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Coming Soon Notice */}
            <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30">
                <CardContent className="flex items-center gap-4 py-4">
                    <Sparkles className="h-8 w-8 text-blue-400" />
                    <div>
                        <h3 className="font-semibold text-white">Full Resume Editor Coming Soon!</h3>
                        <p className="text-sm text-slate-400">
                            The complete resume builder with AI suggestions, ATS optimization, and PDF export is under development.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
