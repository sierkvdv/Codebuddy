"use client";

import { trpc } from "@/lib/trpc-client";
import { motion } from "framer-motion";
import { Trophy, Star, Flame } from "lucide-react";

export default function ProgressHeader() {
  const { data: profile } = trpc.user.getProfile.useQuery();
  const { data: progressData } = trpc.submission.getProgress.useQuery();

  if (!profile) {
    return null;
  }

  const xpInCurrentLevel = profile.xp % 500;
  const xpProgressPercentage = (xpInCurrentLevel / 500) * 100;
  const badgeCount = progressData?.badges?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md border-b"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* User Info & XP */}
          <div className="flex items-center gap-6">
            {/* Avatar */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || "User"}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {profile.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            {/* Level Progress */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Level {profile.level}</span>
                {profile.displayName && (
                  <span className="text-sm text-gray-400">• {profile.displayName}</span>
                )}
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgressPercentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {xpInCurrentLevel} / 500 XP
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-semibold text-gray-800">{profile.xp} XP</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{badgeCount} Badges</div>
                <div className="text-xs text-gray-500">Earned</div>
              </div>
            </div>
          </div>

          {/* Streak (placeholder) */}
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <span className="font-semibold text-orange-800">0 day streak</span>
              <span className="text-xs text-orange-600 ml-2">(Coming soon!)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
