"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Bell, Search, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Resume Builder", href: "/resume" },
    { name: "Cover Letter", href: "/cover-letter" },
    { name: "Interview Prep", href: "/interview" },
    { name: "Industry Insights", href: "/insights" },
    { name: "Settings", href: "/settings" },
];

// Get page title based on current path
function getPageTitle(pathname) {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/resume")) return "Resume Builder";
    if (pathname.startsWith("/cover-letter")) return "Cover Letter Generator";
    if (pathname.startsWith("/interview")) return "Interview Preparation";
    if (pathname.startsWith("/insights")) return "Industry Insights";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Career Advisor";
}

export default function Header({ user }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pageTitle = getPageTitle(pathname);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
            <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
                {/* Mobile menu button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 bg-slate-900 border-slate-800 p-0">
                        <SheetHeader className="p-6 border-b border-slate-800">
                            <SheetTitle className="flex items-center gap-2 text-white">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <span>
                                    Career<span className="text-blue-400">AI</span>
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 p-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Page title */}
                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div className="flex flex-1 items-center">
                        <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Search (optional - can be expanded later) */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-64 pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* Separator */}
                        <div className="hidden lg:block h-6 w-px bg-slate-700" />

                        {/* User menu */}
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9",
                                    userButtonPopoverCard: "bg-slate-800 border-slate-700",
                                    userButtonPopoverFooter: "hidden",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
