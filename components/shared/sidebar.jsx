"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Mail,
    Briefcase,
    LineChart,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Builder", href: "/resume", icon: FileText },
    { name: "Cover Letter", href: "/cover-letter", icon: Mail },
    { name: "Interview Prep", href: "/interview", icon: Briefcase },
    { name: "Industry Insights", href: "/insights", icon: LineChart },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
                    collapsed ? "lg:w-20" : "lg:w-72"
                )}
            >
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-800 bg-slate-900 px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            {!collapsed && (
                                <span className="text-xl font-bold text-white">
                                    Career<span className="text-blue-400">AI</span>
                                </span>
                            )}
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex text-slate-400 hover:text-white"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all",
                                                        isActive
                                                            ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-5 w-5 shrink-0",
                                                            isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                                                        )}
                                                    />
                                                    {!collapsed && item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>

                            {/* User Section */}
                            {!collapsed && (
                                <li className="mt-auto">
                                    <div className="rounded-lg bg-slate-800/50 p-4">
                                        <div className="flex items-center gap-3">
                                            {user?.imageUrl ? (
                                                <img
                                                    src={user.imageUrl}
                                                    alt={user.name || "User"}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                                    <span className="text-sm font-medium text-white">
                                                        {user?.name?.[0] || "U"}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {user?.name || "User"}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {user?.industry || "Career Explorer"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
