"use client";

import { trpc } from "@/lib/trpc-client";
import WorldCard from "@/components/WorldCard";
import ProgressHeader from "@/components/ProgressHeader";
import { motion } from "framer-motion";

export default function WorldsPage() {
  const { data: worlds, isLoading } = trpc.world.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading worlds...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <ProgressHeader />
      
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Choose Your World
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {worlds?.map((world, index) => (
            <WorldCard
              key={world.id}
              world={world}
              progress={world.progress}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
