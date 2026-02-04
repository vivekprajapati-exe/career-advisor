"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateCoverLetter, saveCoverLetter } from "@/actions/cover-letter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Mail, Sparkles, Loader2, Copy, Download, Save, Clock, Building2 } from "lucide-react";
import { format } from "date-fns";

export default function CoverLetterGenerator({ coverLetters, user }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState(null);

    const [formData, setFormData] = useState({
        jobTitle: "",
        companyName: "",
        jobDescription: "",
        tone: "professional",
    });

    const handleGenerate = async () => {
        if (!formData.jobTitle || !formData.companyName || !formData.jobDescription) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateCoverLetter(formData, formData.tone);
            setGeneratedLetter(result);
            toast.success("Cover letter generated!");
        } catch (error) {
            toast.error("Failed to generate cover letter");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedLetter) return;

        setIsSaving(true);
        try {
            await saveCoverLetter({
                jobTitle: formData.jobTitle,
                companyName: formData.companyName,
                jobDescription: formData.jobDescription,
                content: generatedLetter.content,
                tone: formData.tone,
                status: "completed",
            });
            toast.success("Cover letter saved!");
        } catch (error) {
            toast.error("Failed to save cover letter");
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLetter) {
            navigator.clipboard.writeText(generatedLetter.content);
            toast.success("Copied to clipboard!");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Cover Letter Generator</h1>
                <p className="text-slate-400">Create tailored cover letters with AI assistance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-400" />
                            Job Details
                        </CardTitle>
                        <CardDescription>Enter the job information to generate a personalized cover letter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Job Title *</Label>
                                <Input
                                    placeholder="e.g., Software Engineer"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Company Name *</Label>
                                <Input
                                    placeholder="e.g., Google"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Job Description *</Label>
                            <Textarea
                                placeholder="Paste the job description here..."
                                value={formData.jobDescription}
                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Tone</Label>
                            <Select
                                value={formData.tone}
                                onValueChange={(value) => setFormData({ ...formData, tone: value })}
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="professional" className="text-white">Professional</SelectItem>
                                    <SelectItem value="enthusiastic" className="text-white">Enthusiastic</SelectItem>
                                    <SelectItem value="formal" className="text-white">Formal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                            )}
                            Generate Cover Letter
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Letter */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Generated Cover Letter</CardTitle>
                        <CardDescription>
                            {generatedLetter ? `${generatedLetter.wordCount} words` : "Your cover letter will appear here"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {generatedLetter ? (
                            <div className="space-y-4">
                                <div className="bg-slate-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                    <p className="text-slate-300 whitespace-pre-wrap">{generatedLetter.content}</p>
                                </div>

                                {generatedLetter.keyMatchedSkills && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm text-slate-400">Highlighted skills:</span>
                                        {generatedLetter.keyMatchedSkills.map((skill) => (
                                            <Badge key={skill} className="bg-green-500/20 text-green-300">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button onClick={copyToClipboard} variant="outline" className="flex-1 border-slate-600">
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-green-600 hover:bg-green-700">
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                                <Mail className="h-12 w-12 mb-4 opacity-50" />
                                <p>Fill in the job details and click generate</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Previous Cover Letters */}
            {coverLetters?.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Previous Cover Letters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coverLetters.map((letter) => (
                                <div
                                    key={letter.id}
                                    className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-white">{letter.jobTitle}</h4>
                                            <p className="text-sm text-slate-400 flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                {letter.companyName}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                                            {letter.tone}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(letter.createdAt), "MMM d, yyyy")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
