"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Code, Trophy, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="w-16 h-16 text-purple-500" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to CodeBuddy
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Learn to code through interactive games! Travel through magical worlds,
            solve coding challenges, and watch your robot buddy bring your code to life.
          </p>

          <Link href="/worlds">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Your Adventure
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Code className="w-8 h-8" />}
            title="Interactive Challenges"
            description="Learn by doing with hands-on coding challenges designed for absolute beginners."
            delay={0.2}
          />
          <FeatureCard
            icon={<Rocket className="w-8 h-8" />}
            title="Themed Worlds"
            description="Explore If Forest, Loop Lagoon, Function Factory and more exciting destinations."
            delay={0.4}
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Track Progress"
            description="Earn XP, unlock badges, and watch your coding skills grow with every challenge."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-purple-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

