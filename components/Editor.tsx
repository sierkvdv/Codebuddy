"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Play, Send, Blocks, Code } from "lucide-react";
import { useState } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  language?: string;
  theme?: string;
  blockDefinition?: any | null; // JSONB block definition from challenge
}

/**
 * Editor Component
 * Wrapper around Monaco Editor configured for JavaScript/TypeScript
 * Features:
 * - Simplified toolbar
 * - Accepts code input
 * - Block translation support (visual blocks <-> code)
 * - Run/Submit handlers
 */
export default function Editor({
  value,
  onChange,
  onRun,
  onSubmit,
  isSubmitting = false,
  language = "javascript",
  theme = "vs-dark",
  blockDefinition = null,
}: EditorProps) {
  const [editorMode, setEditorMode] = useState<"text" | "blocks">(
    blockDefinition ? "blocks" : "text"
  );

  // TODO: Implement block-to-code translation
  const translateBlocksToCode = (blocks: any): string => {
    // This would convert visual block structure to JavaScript code
    // For now, return starter code
    return "// Block-based coding coming soon!\n";
  };

  // TODO: Implement code-to-blocks translation
  const translateCodeToBlocks = (code: string): any => {
    // This would parse JavaScript code into visual blocks
    return null;
  };

  const handleModeSwitch = () => {
    if (!blockDefinition) return; // Can't switch if no block definition

    if (editorMode === "text") {
      // Switch to blocks - translate current code
      const blocks = translateCodeToBlocks(value);
      setEditorMode("blocks");
    } else {
      // Switch to text - translate blocks
      const code = translateBlocksToCode(null);
      onChange(code);
      setEditorMode("text");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Editor Header / Toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        {/* Window Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* File Name / Mode Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-mono">
            {editorMode === "blocks" ? "blocks.js" : "editor.js"}
          </span>

          {/* Mode Toggle (if blocks available) */}
          {blockDefinition && (
            <button
              onClick={handleModeSwitch}
              className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs transition-colors"
              title={`Switch to ${editorMode === "text" ? "blocks" : "text"} mode`}
            >
              {editorMode === "text" ? (
                <>
                  <Blocks className="w-3 h-3" />
                  <span>Blocks</span>
                </>
              ) : (
                <>
                  <Code className="w-3 h-3" />
                  <span>Code</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Language Badge */}
        <div className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold">
          {language.toUpperCase()}
        </div>
      </div>

      {/* Editor Area */}
      <div className="h-[400px]">
        {editorMode === "text" ? (
          // Monaco Text Editor
          <MonacoEditor
            height="100%"
            language={language}
            theme={theme}
            value={value}
            onChange={(val) => onChange(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              folding: true,
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        ) : (
          // Block-based Editor (Placeholder)
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
              <Blocks className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Block-Based Coding
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop blocks to build your code visually!
              </p>
              <p className="text-sm text-gray-500">
                Coming soon... For now, switch to text mode.
              </p>
              <button
                onClick={() => setEditorMode("text")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Switch to Text Mode
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
        {/* Info/Stats */}
        <div className="text-xs text-gray-500">
          {value.split("\n").length} lines • {value.length} chars
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Run Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRun}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>Run Code</span>
          </motion.button>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={isSubmitting || !value.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Getting help..." : "Show me the answer"}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
