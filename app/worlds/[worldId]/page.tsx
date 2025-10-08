"use client";

import { trpc } from "@/lib/trpc-client";
import LevelCard from "@/components/LevelCard";
import ProgressHeader from "@/components/ProgressHeader";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WorldDetailPage() {
  const params = useParams();
  const worldId = params.worldId as string;

  const { data: worlds } = trpc.world.list.useQuery();
  const { data: levels, isLoading: levelsLoading } = trpc.world.getLevels.useQuery({ worldId });

  const world = worlds?.find((w) => w.id === worldId);

  if (levelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">World not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <ProgressHeader />

      <div className="container mx-auto px-4 py-8">
        <Link href="/worlds">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Worlds
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {world.name}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">{world.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {levels?.map((level, index) => (
            <LevelCard
              key={level.id}
              level={level}
              worldId={worldId}
              isLocked={level.isLocked}
              isCompleted={level.isCompleted}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
