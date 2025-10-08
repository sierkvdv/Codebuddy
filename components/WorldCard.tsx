"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { World } from "@/types/db";
import { Lock, CheckCircle } from "lucide-react";

interface WorldCardProps {
  world: World;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  delay?: number;
}

export default function WorldCard({ world, progress, delay = 0 }: WorldCardProps) {
  const isLocked = false; // TODO: Implement world unlock logic
  const percentage = progress?.percentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative"
    >
      <Link href={isLocked ? "#" : `/worlds/${world.id}`}>
        <div
          className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all ${
            isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {/* Icon */}
          <div className="text-5xl mb-4">{world.icon || "🌍"}</div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 text-gray-800">{world.name}</h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">{world.description}</p>

          {/* Progress Bar */}
          {progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: delay + 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Status Icon */}
          <div className="flex items-center justify-between">
            {isLocked ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Locked</span>
              </div>
            ) : percentage === 100 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Completed!</span>
              </div>
            ) : (
              <div className="text-sm text-blue-600 font-semibold">Start Adventure →</div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

