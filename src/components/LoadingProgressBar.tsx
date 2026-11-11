import React from "react";
import { motion } from "motion/react";
import { Folder, Sparkles, CheckCircle2, Download, Search } from "lucide-react";
import { LoadingProgress } from "../types";

interface LoadingProgressBarProps {
  progress: LoadingProgress;
}

export default function LoadingProgressBar({ progress }: LoadingProgressBarProps) {
  if (!progress.isActive) return null;

  const percent = Math.min(100, Math.max(0, Math.round(progress.percent)));

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full bg-white border-2 border-gray-900/90 rounded-2xl shadow-xl p-6 sm:p-7 relative overflow-hidden"
    >
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-[#00cc7a] to-emerald-600" />

      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Title styled exactly like the user's reference image */}
        <div className="flex items-center space-x-2.5 mb-3">
          {progress.type === "check" ? (
            <Search className="w-6 h-6 text-gray-900 animate-pulse" />
          ) : (
            <Download className="w-6 h-6 text-[#00cc7a] animate-bounce" />
          )}
          <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-gray-950 uppercase select-none flex items-center">
            {progress.title || "LOADING"}
            <span className="inline-flex w-8 text-left text-[#00cc7a] font-black animate-pulse ml-0.5">
              ...
            </span>
          </h2>
        </div>

        {/* Subtitle / Current Action description */}
        <div className="text-xs sm:text-sm font-medium text-gray-600 mb-5 flex flex-wrap items-center justify-center gap-2">
          {progress.currentFolder && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                progress.currentFolder === "resourcepacks"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : progress.currentFolder === "shaderpacks"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              <Folder className="w-3 h-3" />
              {progress.currentFolder === "resourcepacks" ? "resourcepacks/" : progress.currentFolder === "shaderpacks" ? "shaderpacks/" : "mods/"}
            </span>
          )}
          <span className="font-semibold text-gray-800 truncate max-w-[320px] sm:max-w-[450px]">
            {progress.currentItemName || "Đang chuẩn bị dữ liệu..."}
          </span>
          {progress.detail && (
            <span className="text-gray-400 text-xs hidden sm:inline">
              ({progress.detail})
            </span>
          )}
        </div>

        {/* 
          Main Progress Bar Container
          Matches exact look from user reference:
          Pill capsule with dark outline and vibrant green fill
        */}
        <div className="w-full max-w-xl">
          <div className="w-full h-8 sm:h-9 bg-gray-100 rounded-full border-[3.5px] border-gray-950 p-1 relative overflow-hidden shadow-inner flex items-center">
            {/* The animated green filling bar */}
            <motion.div
              className="h-full rounded-full bg-[#00cc7a] relative shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                background: "linear-gradient(90deg, #059669 0%, #00cc7a 70%, #10b981 100%)"
              }}
            >
              {/* Shimmer light effect inside the green fill */}
              <div className="absolute inset-0 bg-white/25 rounded-full overflow-hidden">
                <div className="w-full h-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Progress Indicators (Percentage & Item Count) */}
          <div className="flex items-center justify-between mt-3 text-xs font-mono font-bold text-gray-700 px-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {percent}%
              </span>
              <span className="text-gray-500 font-normal">hoàn tất</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-600">
              <span className="text-gray-900 font-bold">{progress.currentIndex}</span>
              <span className="text-gray-400">/</span>
              <span>{progress.totalItems} mục</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
