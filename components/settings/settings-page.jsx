"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user";
import { industries, experienceLevels, remotePreferences } from "@/data/industries";
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
import { User, Briefcase, Target, Save, Loader2 } from "lucide-react";

export default function SettingsPage({ user }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        currentRole: user?.currentRole || "",
        industry: industries.find((i) => i.name === user?.industry)?.id || "",
        experience: user?.experience?.toString() || "",
        bio: user?.bio || "",
        skills: user?.skills || [],
        targetRoles: user?.targetRoles || [],
        remotePreference: user?.remotePreference || "",
    });

    const [newSkill, setNewSkill] = useState("");
    const [newTargetRole, setNewTargetRole] = useState("");

    const selectedIndustry = industries.find((i) => i.id === formData.industry);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                name: formData.name,
                currentRole: formData.currentRole,
                industry: selectedIndustry?.name || formData.industry,
                experience: formData.experience ? parseInt(formData.experience) : null,
                bio: formData.bio,
                skills: formData.skills,
                targetRoles: formData.targetRoles,
                remotePreference: formData.remotePreference,
            });
            toast.success("Settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill] });
            setNewSkill("");
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const addTargetRole = () => {
        if (newTargetRole && !formData.targetRoles.includes(newTargetRole)) {
            setFormData({
                ...formData,
                targetRoles: [...formData.targetRoles, newTargetRole],
            });
            setNewTargetRole("");
        }
    };

    const removeTargetRole = (role) => {
        setFormData({
            ...formData,
            targetRoles: formData.targetRoles.filter((r) => r !== role),
        });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Manage your profile and preferences</p>
            </div>

            {/* Personal Info */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Full Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Email</Label>
                            <Input
                                value={user?.email || ""}
                                disabled
                                className="bg-slate-700 border-slate-600 text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">Professional Bio</Label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Write a short professional bio..."
                            className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Career Info */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-400" />
                        Career Information
                    </CardTitle>
                    <CardDescription>Your current role and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Current Role</Label>
                            <Input
                                value={formData.currentRole}
                                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                placeholder="e.g., Software Engineer"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Years of Experience</Label>
                            <Select
                                value={formData.experience}
                                onValueChange={(v) => setFormData({ ...formData, experience: v })}
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
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Industry</Label>
                        <Select
                            value={formData.industry}
                            onValueChange={(v) => setFormData({ ...formData, industry: v })}
                        >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {industries.map((industry) => (
                                    <SelectItem key={industry.id} value={industry.id} className="text-white">
                                        {industry.icon} {industry.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Skills</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                placeholder="Add a skill"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Button onClick={addSkill} variant="outline" className="border-slate-600">
                                Add
                            </Button>
                        </div>
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        className="bg-blue-500/20 text-blue-300 cursor-pointer hover:bg-red-500/20"
                                        onClick={() => removeSkill(skill)}
                                    >
                                        {skill} ×
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Goals */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-400" />
                        Career Goals
                    </CardTitle>
                    <CardDescription>Your target roles and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Target Roles</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTargetRole}
                                onChange={(e) => setNewTargetRole(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTargetRole())}
                                placeholder="Add a target role"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Button onClick={addTargetRole} variant="outline" className="border-slate-600">
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
                            onValueChange={(v) => setFormData({ ...formData, remotePreference: v })}
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
                </CardContent>
            </Card>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
            </Button>
        </div>
    );
}
