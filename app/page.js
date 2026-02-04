import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  Mail,
  Briefcase,
  LineChart,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Create professional resumes with AI-powered content improvement and ATS optimization.",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Generate personalized cover letters tailored to specific job descriptions in seconds.",
  },
  {
    icon: Briefcase,
    title: "Interview Preparation",
    description:
      "Practice with AI-generated questions and get instant feedback to ace your interviews.",
  },
  {
    icon: LineChart,
    title: "Industry Insights",
    description:
      "Get real-time data on salary trends, in-demand skills, and market outlook for your industry.",
  },
];

const benefits = [
  "AI-powered personalization",
  "ATS-optimized resumes",
  "Industry-specific insights",
  "Interview practice with feedback",
  "Cover letters in seconds",
  "100% free to use",
];

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Career<span className="text-blue-400">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 border border-blue-600/20 px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-blue-300">Powered by AI • 100% Free</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Career Advisor
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-10">
            Build professional resumes, generate tailored cover letters, prepare for interviews,
            and get personalized industry insights—all powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Benefits list */}
          <div className="flex flex-wrap justify-center gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 rounded-full bg-slate-800/50 px-4 py-2"
              >
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Land Your Dream Job
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our AI-powered tools help you stand out from the competition at every step of your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who have accelerated their career with our AI-powered platform.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Career<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              © 2026 CareerAI. Built with ❤️ for job seekers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
