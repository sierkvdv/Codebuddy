"use client";

import { trpc } from "@/lib/trpc-client";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Home, Map, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * Defines the page scaffold with:
 * - Header with XP/badges
 * - Navigation
 * - Main content area
 */
export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { data: profile } = trpc.user.getProfile.useQuery();
  const { data: progressData } = trpc.submission.getProgress.useQuery();

  const xpInCurrentLevel = profile?.xp ? profile.xp % 500 : 0;
  const xpProgressPercentage = (xpInCurrentLevel / 500) * 100;
  const badgeCount = progressData?.badges?.length || 0;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/worlds", label: "Worlds", icon: Map },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="text-3xl">🤖</div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeBuddy
                </h1>
              </div>
            </Link>

            {/* User Progress (if logged in) */}
            {profile && (
              <div className="flex items-center gap-6">
                {/* Avatar */}
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {profile.displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                {/* XP Progress */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-600">Level {profile.level}</span>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgressPercentage}%` }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {xpInCurrentLevel} / 500 XP
                  </div>
                </div>

                {/* Total XP */}
                <div className="hidden lg:flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <div className="text-sm font-semibold text-gray-800">{profile.xp} XP</div>
                </div>

                {/* Badges */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="text-xl">🏆</div>
                  <div className="text-sm font-semibold text-gray-800">{badgeCount}</div>
                </div>

                {/* Streak */}
                <div className="hidden xl:flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-800">0 🔥</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                      isActive
                        ? "border-purple-600 text-purple-600 font-semibold"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)]">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © 2024 CodeBuddy. Learn to code through play.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Link href="/about" className="hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-purple-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-purple-600 transition-colors">
                Terms
              </Link>
              <Link href="/help" className="hover:text-purple-600 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

