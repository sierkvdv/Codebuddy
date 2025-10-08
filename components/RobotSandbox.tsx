"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runCodeInSandbox } from "@/lib/sandbox";

interface RobotSandboxProps {
  code: string;
}

type RobotState = "idle" | "thinking" | "success" | "error";

/**
 * RobotSandbox Component
 * Implements a visual robot character scene
 * Features:
 * - Robot character visualization (Canvas-based, PixiJS in future)
 * - Listens for events from Editor (code execution)
 * - Animates based on success/failure
 * - Console output display
 */
export default function RobotSandbox({ code }: RobotSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [output, setOutput] = useState<string[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Listen for code changes (events from Editor)
  useEffect(() => {
    if (!code) {
      setRobotState("idle");
      setOutput([]);
      return;
    }

    // Robot enters "thinking" state
    setRobotState("thinking");
    setOutput(["🤖 Running your code..."]);

    // Simulate processing delay (robot thinking animation)
    const timer = setTimeout(() => {
      const result = runCodeInSandbox(code);

      if (result.success) {
        // Success animation
        setRobotState("success");
        setOutput([
          "✅ Code executed successfully!",
          ...(result.logs || []),
          result.output !== undefined ? `→ Returned: ${JSON.stringify(result.output)}` : "",
        ].filter(Boolean));
      } else {
        // Error animation
        setRobotState("error");
        setOutput([
          "❌ Code execution failed",
          ...(result.logs || []),
          result.error ? `Error: ${result.error}` : "",
        ].filter(Boolean));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [code]);

  // Render robot animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      setAnimationPhase(frameCount);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Robot colors based on state
      const bodyColor =
        robotState === "error"
          ? "#ef4444"
          : robotState === "success"
          ? "#22c55e"
          : robotState === "thinking"
          ? "#3b82f6"
          : "#6b7280";

      // Thinking animation (slight bounce)
      const bounce = robotState === "thinking" ? Math.sin(frameCount * 0.1) * 3 : 0;

      // Success animation (celebration jump)
      const celebrate =
        robotState === "success"
          ? Math.max(0, 20 - frameCount * 0.5) * Math.sin(frameCount * 0.3)
          : 0;

      // Error animation (shake)
      const shake =
        robotState === "error" && frameCount < 30
          ? Math.sin(frameCount * 0.8) * 3
          : 0;

      const robotY = centerY + bounce - celebrate;
      const robotX = centerX + shake;

      // Robot body
      ctx.fillStyle = bodyColor;
      ctx.fillRect(robotX - 40, robotY - 40, 80, 80);

      // Robot head antenna
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(robotX, robotY - 40);
      ctx.lineTo(robotX, robotY - 60);
      ctx.stroke();

      // Antenna bulb (blinks when thinking)
      const blinkPhase = Math.sin(frameCount * 0.15);
      if (robotState === "thinking" || blinkPhase > 0) {
        ctx.fillStyle = robotState === "thinking" ? "#fbbf24" : bodyColor;
        ctx.beginPath();
        ctx.arc(robotX, robotY - 60, 5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Robot eyes
      ctx.fillStyle = "#fff";
      const eyeOffset = robotState === "thinking" ? Math.sin(frameCount * 0.2) * 2 : 0;

      if (robotState === "success") {
        // Happy eyes (^_^)
        ctx.beginPath();
        ctx.arc(robotX - 20, robotY - 15, 8, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(robotX + 20, robotY - 15, 8, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (robotState === "error") {
        // Sad eyes (>_<)
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(robotX - 28, robotY - 20);
        ctx.lineTo(robotX - 12, robotY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(robotX + 12, robotY - 10);
        ctx.lineTo(robotX + 28, robotY - 20);
        ctx.stroke();
      } else {
        // Normal eyes
        ctx.fillRect(robotX - 25, robotY - 20 + eyeOffset, 15, 15);
        ctx.fillRect(robotX + 10, robotY - 20 + eyeOffset, 15, 15);
      }

      // Robot mouth
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();

      if (robotState === "success") {
        // Big smile
        ctx.arc(robotX, robotY + 10, 25, 0.2 * Math.PI, 0.8 * Math.PI);
      } else if (robotState === "error") {
        // Frown
        ctx.arc(robotX, robotY + 30, 20, 1.2 * Math.PI, 1.8 * Math.PI);
      } else if (robotState === "thinking") {
        // Thoughtful expression (small o)
        ctx.arc(robotX, robotY + 15, 8, 0, 2 * Math.PI);
      } else {
        // Neutral line
        ctx.moveTo(robotX - 15, robotY + 15);
        ctx.lineTo(robotX + 15, robotY + 15);
      }

      ctx.stroke();

      // Robot arms (wave when successful)
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 4;

      if (robotState === "success") {
        const waveAngle = Math.sin(frameCount * 0.2) * 0.3;
        // Left arm (waving)
        ctx.beginPath();
        ctx.moveTo(robotX - 40, robotY - 20);
        ctx.lineTo(robotX - 60 + Math.cos(waveAngle) * 10, robotY - 30 + Math.sin(waveAngle) * 10);
        ctx.stroke();
      }

      // Continue animation if needed
      if (robotState === "thinking" || (robotState === "success" && frameCount < 60)) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (robotState === "error" && frameCount < 30) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [robotState]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">🤖</div>
        <h3 className="text-xl font-semibold text-gray-800">Robot Buddy</h3>
        <div
          className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
            robotState === "idle"
              ? "bg-gray-100 text-gray-600"
              : robotState === "thinking"
              ? "bg-blue-100 text-blue-600"
              : robotState === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {robotState === "idle"
            ? "Waiting"
            : robotState === "thinking"
            ? "Thinking..."
            : robotState === "success"
            ? "Success!"
            : "Error"}
        </div>
      </div>

      {/* Canvas for robot visualization */}
      <div
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-gray-200"
        style={{ height: "200px" }}
      >
        <canvas ref={canvasRef} width={300} height={200} />
      </div>

      {/* Console Output */}
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto">
        <div className="text-green-400 mb-2 flex items-center gap-2">
          <span>$</span>
          <span className="text-gray-500">console.log</span>
        </div>
        <AnimatePresence mode="popLayout">
          {output.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500"
            >
              Click "Run Code" to execute your code...
            </motion.div>
          ) : (
            output.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.1 }}
                className={
                  line.startsWith("❌") || line.startsWith("Error")
                    ? "text-red-400"
                    : line.startsWith("✅")
                    ? "text-green-400"
                    : line.startsWith("🤖")
                    ? "text-blue-400"
                    : "text-gray-300"
                }
              >
                {line}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
