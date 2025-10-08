"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Level } from "@/types/db";
import { Lock, Star, Trophy } from "lucide-react";

interface LevelCardProps {
  level: Level;
  worldId: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  stars?: number;
  delay?: number;
}

export default function LevelCard({
  level,
  worldId,
  isLocked = false,
  isCompleted = false,
  stars = 0,
  delay = 0,
}: LevelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      className="relative"
    >
      <Link href={isLocked ? "#" : `/worlds/${worldId}/levels/${level.id}`}>
        <div
          className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all ${
            isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${isCompleted ? "border-2 border-green-400" : ""}`}
        >
          {/* Lock overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 rounded-lg">
              <Lock className="w-8 h-8 text-gray-500" />
            </div>
          )}

          {/* Level number badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
              Level {level.order}
            </div>

            {/* Completion status */}
            {isCompleted && (
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{level.name}</h4>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{level.description}</p>

          {/* XP Reward */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-purple-600">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">{level.xpReward} XP</span>
            </div>

            {!isLocked && !isCompleted && (
              <span className="text-blue-600 font-semibold">Start →</span>
            )}

            {isCompleted && <span className="text-green-600 font-semibold">Replay</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

