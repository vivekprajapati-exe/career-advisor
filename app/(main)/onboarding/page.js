"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { completeOnboarding, generateBio } from "@/actions/user";
import { industries, experienceLevels, remotePreferences, skillCategories } from "@/data/industries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Check,
    Briefcase,
    Target,
    User,
    Rocket,
} from "lucide-react";

const STEPS = [
    { id: 1, title: "Industry", icon: Briefcase },
    { id: 2, title: "Experience", icon: User },
    { id: 3, title: "Skills", icon: Target },
    { id: 4, title: "Goals", icon: Rocket },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);

    const [formData, setFormData] = useState({
        industry: "",
        subIndustry: "",
        experience: null,
        currentRole: "",
        skills: [],
        targetRoles: [],
        remotePreference: "",
        bio: "",
    });

    const [newSkill, setNewSkill] = useState("");
    const [newTargetRole, setNewTargetRole] = useState("");

    const selectedIndustry = industries.find((i) => i.id === formData.industry);
    const progress = (currentStep / STEPS.length) * 100;

    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addSkill = (skill) => {
        if (skill && !formData.skills.includes(skill)) {
            updateFormData("skills", [...formData.skills, skill]);
        }
        setNewSkill("");
    };

    const removeSkill = (skill) => {
        updateFormData("skills", formData.skills.filter((s) => s !== skill));
    };

    const addTargetRole = () => {
        if (newTargetRole && !formData.targetRoles.includes(newTargetRole)) {
            updateFormData("targetRoles", [...formData.targetRoles, newTargetRole]);
            setNewTargetRole("");
        }
    };

    const removeTargetRole = (role) => {
        updateFormData("targetRoles", formData.targetRoles.filter((r) => r !== role));
    };

    const handleGenerateBio = async () => {
        if (!formData.currentRole || !formData.industry) {
            toast.error("Please fill in your industry and current role first");
            return;
        }

        setIsGeneratingBio(true);
        try {
            const bio = await generateBio({
                name: "",
                currentRole: formData.currentRole,
                industry: selectedIndustry?.name || formData.industry,
                experience: formData.experience,
                skills: formData.skills,
            });
            updateFormData("bio", bio);
            toast.success("Bio generated successfully!");
        } catch (error) {
            toast.error("Failed to generate bio");
        } finally {
            setIsGeneratingBio(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await completeOnboarding({
                industry: selectedIndustry?.name || formData.industry,
                subIndustry: formData.subIndustry,
                experience: formData.experience,
                currentRole: formData.currentRole,
                skills: formData.skills,
                targetRoles: formData.targetRoles,
                remotePreference: formData.remotePreference,
                bio: formData.bio,
            });
            toast.success("Profile completed successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.industry;
            case 2:
                return formData.experience !== null && formData.currentRole;
            case 3:
                return formData.skills.length >= 1;
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Career<span className="text-blue-400">AI</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Let's set up your profile</h1>
                    <p className="text-slate-400 mt-2">
                        Help us personalize your career journey
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 ${step.id <= currentStep ? "text-white" : "text-slate-500"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id < currentStep
                                            ? "bg-green-500"
                                            : step.id === currentStep
                                                ? "bg-blue-600"
                                                : "bg-slate-700"
                                        }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <step.icon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                            </div>
                        ))}
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Form Card */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {currentStep === 1 && "Select Your Industry"}
                            {currentStep === 2 && "Your Experience"}
                            {currentStep === 3 && "Add Your Skills"}
                            {currentStep === 4 && "Career Goals"}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === 1 && "Choose the industry you work in or want to work in"}
                            {currentStep === 2 && "Tell us about your current role and experience"}
                            {currentStep === 3 && "Add skills to match with job requirements"}
                            {currentStep === 4 && "Set your career preferences and write your bio"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1: Industry */}
                        {currentStep === 1 && (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {industries.map((industry) => (
                                        <button
                                            key={industry.id}
                                            onClick={() => updateFormData("industry", industry.id)}
                                            className={`p-4 rounded-lg border text-left transition-all ${formData.industry === industry.id
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-slate-600 hover:border-slate-500 bg-slate-700/50"
                                                }`}
                                        >
                                            <span className="text-2xl mb-2 block">{industry.icon}</span>
                                            <span className="text-sm font-medium text-white">{industry.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedIndustry && (
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Specialization (Optional)</Label>
                                        <Select
                                            value={formData.subIndustry}
                                            onValueChange={(value) => updateFormData("subIndustry", value)}
                                        >
                                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                <SelectValue placeholder="Select specialization" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {selectedIndustry.subIndustries.map((sub) => (
                                                    <SelectItem key={sub} value={sub} className="text-white">
                                                        {sub}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 2: Experience */}
                        {currentStep === 2 && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Current Role</Label>
                                    <Input
                                        placeholder="e.g., Software Engineer, Marketing Manager"
                                        value={formData.currentRole}
                                        onChange={(e) => updateFormData("currentRole", e.target.value)}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Years of Experience</Label>
                                    <Select
                                        value={formData.experience?.toString()}
                                        onValueChange={(value) => updateFormData("experience", parseInt(value))}
                                    >
                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                            <SelectValue placeholder="Select experience" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {experienceLevels.map((level) => (
                                                <SelectItem
                                                    key={level.value}
                                                    value={level.value.toString()}
                                                    className="text-white"
                                                >
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {/* Step 3: Skills */}
                        {currentStep === 3 && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Add Skills</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Type a skill and press Enter"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addSkill(newSkill);
                                                }
                                            }}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => addSkill(newSkill)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                className="bg-blue-500/20 text-blue-300 cursor-pointer hover:bg-red-500/20 hover:text-red-300"
                                                onClick={() => removeSkill(skill)}
                                            >
                                                {skill} ×
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Suggested Skills</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            ...skillCategories.technical.slice(0, 5),
                                            ...skillCategories.soft.slice(0, 3),
                                        ].map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className={`cursor-pointer border-slate-600 ${formData.skills.includes(skill)
                                                        ? "bg-green-500/20 text-green-300 border-green-500"
                                                        : "text-slate-400 hover:text-white hover:border-slate-500"
                                                    }`}
                                                onClick={() => {
                                                    if (formData.skills.includes(skill)) {
                                                        removeSkill(skill);
                                                    } else {
                                                        addSkill(skill);
                                                    }
                                                }}
                                            >
                                                {formData.skills.includes(skill) && <Check className="h-3 w-3 mr-1" />}
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 4: Goals */}
                        {currentStep === 4 && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Target Roles (Optional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g., Senior Developer"
                                            value={newTargetRole}
                                            onChange={(e) => setNewTargetRole(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTargetRole();
                                                }
                                            }}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addTargetRole}
                                            variant="outline"
                                            className="border-slate-600"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {formData.targetRoles.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.targetRoles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    className="bg-purple-500/20 text-purple-300 cursor-pointer hover:bg-red-500/20"
                                                    onClick={() => removeTargetRole(role)}
                                                >
                                                    {role} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">Work Preference</Label>
                                    <Select
                                        value={formData.remotePreference}
                                        onValueChange={(value) => updateFormData("remotePreference", value)}
                                    >
                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                            <SelectValue placeholder="Select preference" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {remotePreferences.map((pref) => (
                                                <SelectItem key={pref.value} value={pref.value} className="text-white">
                                                    {pref.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Professional Bio</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleGenerateBio}
                                            disabled={isGeneratingBio}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            {isGeneratingBio ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Sparkles className="h-4 w-4 mr-2" />
                                            )}
                                            Generate with AI
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="Write a short professional bio or let AI generate one"
                                        value={formData.bio}
                                        onChange={(e) => updateFormData("bio", e.target.value)}
                                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        disabled={currentStep === 1}
                        className="border-slate-600"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={() => setCurrentStep((prev) => prev + 1)}
                            disabled={!canProceed()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            Continue
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Complete Setup
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
