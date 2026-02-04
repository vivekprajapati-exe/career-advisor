"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { startSession, submitAnswer, completeSession } from "@/actions/interview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Briefcase,
    Play,
    Loader2,
    CheckCircle,
    XCircle,
    Trophy,
    Brain,
    Target,
    Clock,
    ArrowRight,
    RotateCcw,
} from "lucide-react";
import { format } from "date-fns";

export default function InterviewPrep({ sessions, user }) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [finalFeedback, setFinalFeedback] = useState(null);

    const [settings, setSettings] = useState({
        category: "mixed",
        difficulty: "medium",
        role: user?.currentRole || "",
    });

    const handleStartSession = async () => {
        setIsStarting(true);
        try {
            const session = await startSession(settings.category, settings.role, settings.difficulty);
            setCurrentSession(session);
            setCurrentQuestionIndex(0);
            setShowResult(false);
            setSessionComplete(false);
            toast.success("Interview session started!");
        } catch (error) {
            toast.error("Failed to start session");
        } finally {
            setIsStarting(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer) {
            toast.error("Please select an answer");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitAnswer(currentSession.id, currentQuestionIndex, selectedAnswer);
            setLastResult(result);
            setShowResult(true);
            setCurrentSession(result.session);
        } catch (error) {
            toast.error("Failed to submit answer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex + 1 >= currentSession.totalQuestions) {
            // Complete session
            try {
                const result = await completeSession(currentSession.id);
                setFinalFeedback(result.feedback);
                setSessionComplete(true);
            } catch (error) {
                toast.error("Failed to complete session");
            }
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer("");
            setShowResult(false);
            setLastResult(null);
        }
    };

    const handleRestart = () => {
        setCurrentSession(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setShowResult(false);
        setLastResult(null);
        setSessionComplete(false);
        setFinalFeedback(null);
    };

    const currentQuestion = currentSession?.questions?.[currentQuestionIndex];

    // Session Complete View
    if (sessionComplete && finalFeedback) {
        const score = currentSession.correctAnswers / currentSession.totalQuestions * 100;
        return (
            <div className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-8 pb-8">
                        <div className="text-center space-y-6">
                            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${score >= 70 ? "bg-green-500/20" : score >= 50 ? "bg-yellow-500/20" : "bg-red-500/20"
                                }`}>
                                <Trophy className={`h-12 w-12 ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
                                    }`} />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
                                <p className="text-slate-400">
                                    You scored {currentSession.correctAnswers} out of {currentSession.totalQuestions}
                                </p>
                            </div>

                            <div className="text-5xl font-bold text-white">{score.toFixed(0)}%</div>

                            <div className="max-w-md mx-auto space-y-4">
                                <p className="text-slate-300">{finalFeedback.assessment}</p>

                                {finalFeedback.strengths?.length > 0 && (
                                    <div className="text-left">
                                        <h4 className="text-sm font-medium text-green-400 mb-2">Strengths:</h4>
                                        <ul className="space-y-1">
                                            {finalFeedback.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-green-400" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {finalFeedback.areasToImprove?.length > 0 && (
                                    <div className="text-left">
                                        <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas to Improve:</h4>
                                        <ul className="space-y-1">
                                            {finalFeedback.areasToImprove.map((a, i) => (
                                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                    <Target className="h-3 w-3 text-yellow-400" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-blue-300 italic">{finalFeedback.encouragement}</p>
                            </div>

                            <Button onClick={handleRestart} className="bg-gradient-to-r from-blue-600 to-purple-600">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Start New Session
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Active Session View
    if (currentSession && currentQuestion) {
        const progress = ((currentQuestionIndex + 1) / currentSession.totalQuestions) * 100;

        return (
            <div className="space-y-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            Question {currentQuestionIndex + 1} of {currentSession.totalQuestions}
                        </h1>
                        <p className="text-slate-400">{currentSession.category} • {currentSession.difficulty}</p>
                    </div>
                    <Badge className={
                        currentSession.correctAnswers / (currentQuestionIndex + (showResult ? 1 : 0)) >= 0.7
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                    }>
                        Score: {currentSession.correctAnswers}/{showResult ? currentQuestionIndex + 1 : currentQuestionIndex}
                    </Badge>
                </div>

                <Progress value={progress} className="h-2" />

                {/* Question Card */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        <h2 className="text-lg font-medium text-white mb-6">{currentQuestion.question}</h2>

                        <RadioGroup
                            value={selectedAnswer}
                            onValueChange={setSelectedAnswer}
                            disabled={showResult}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option, index) => {
                                const letter = option.charAt(0);
                                const isCorrect = showResult && letter === currentQuestion.correctAnswer;
                                const isSelected = selectedAnswer === letter;
                                const isWrong = showResult && isSelected && !isCorrect;

                                return (
                                    <Label
                                        key={index}
                                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${isCorrect
                                                ? "border-green-500 bg-green-500/10"
                                                : isWrong
                                                    ? "border-red-500 bg-red-500/10"
                                                    : isSelected
                                                        ? "border-blue-500 bg-blue-500/10"
                                                        : "border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        <RadioGroupItem value={letter} className="border-slate-600" />
                                        <span className="text-white flex-1">{option}</span>
                                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-400" />}
                                        {isWrong && <XCircle className="h-5 w-5 text-red-400" />}
                                    </Label>
                                );
                            })}
                        </RadioGroup>

                        {showResult && lastResult && (
                            <div className={`mt-6 p-4 rounded-lg ${lastResult.isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
                                }`}>
                                <p className={`font-medium mb-2 ${lastResult.isCorrect ? "text-green-400" : "text-red-400"}`}>
                                    {lastResult.isCorrect ? "Correct!" : "Incorrect"}
                                </p>
                                <p className="text-slate-300 text-sm">{lastResult.explanation}</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            {!showResult ? (
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={!selectedAnswer || isSubmitting}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Submit Answer
                                </Button>
                            ) : (
                                <Button onClick={handleNextQuestion} className="bg-gradient-to-r from-blue-600 to-purple-600">
                                    {currentQuestionIndex + 1 >= currentSession.totalQuestions ? "See Results" : "Next Question"}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Start Session View
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Interview Preparation</h1>
                <p className="text-slate-400">Practice with AI-generated interview questions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Start New Session */}
                <Card className="bg-slate-900/50 border-slate-800 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-400" />
                            Start Practice Session
                        </CardTitle>
                        <CardDescription>Configure your practice settings and begin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Category</Label>
                                <Select
                                    value={settings.category}
                                    onValueChange={(v) => setSettings({ ...settings, category: v })}
                                >
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="behavioral" className="text-white">Behavioral</SelectItem>
                                        <SelectItem value="technical" className="text-white">Technical</SelectItem>
                                        <SelectItem value="mixed" className="text-white">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Difficulty</Label>
                                <Select
                                    value={settings.difficulty}
                                    onValueChange={(v) => setSettings({ ...settings, difficulty: v })}
                                >
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="easy" className="text-white">Easy</SelectItem>
                                        <SelectItem value="medium" className="text-white">Medium</SelectItem>
                                        <SelectItem value="hard" className="text-white">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Target Role</Label>
                                <input
                                    type="text"
                                    value={settings.role}
                                    onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                                    placeholder="e.g., Software Engineer"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleStartSession}
                            disabled={isStarting}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {isStarting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Play className="h-4 w-4 mr-2" />
                            )}
                            Start 10-Question Practice
                        </Button>
                    </CardContent>
                </Card>

                {/* Stats */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Your Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Total Sessions</span>
                            <span className="text-white font-medium">{sessions?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Avg. Score</span>
                            <span className="text-white font-medium">
                                {sessions?.length > 0
                                    ? (sessions.filter(s => s.score).reduce((a, b) => a + (b.score || 0), 0) / sessions.filter(s => s.score).length).toFixed(0)
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Questions Answered</span>
                            <span className="text-white font-medium">
                                {sessions?.reduce((a, b) => a + b.totalQuestions, 0) || 0}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Session History */}
            {sessions?.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {sessions.slice(0, 5).map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${(session.score || 0) >= 70 ? "bg-green-500/20" : "bg-yellow-500/20"
                                            }`}>
                                            <Briefcase className={`h-5 w-5 ${(session.score || 0) >= 70 ? "text-green-400" : "text-yellow-400"
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{session.category} - {session.difficulty}</p>
                                            <p className="text-sm text-slate-400">{session.targetRole || "General"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">
                                            {session.correctAnswers}/{session.totalQuestions}
                                        </p>
                                        <p className="text-sm text-slate-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(session.createdAt), "MMM d")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
