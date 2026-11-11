import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Folder,
  FolderOpen,
  FolderCheck,
  HardDrive,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  RotateCcw,
  Sliders,
  FileCode,
  Terminal,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Info
} from "lucide-react";
import {
  FolderPathsConfig,
  DownloadScope,
  ModStatus,
  FolderSyncFileResult
} from "../types";
import {
  LAUNCHER_PRESETS,
  LauncherPreset,
  getScopeDisplayName,
  generateAutoInstallBat,
  generateAutoInstallSh,
  formatBytes
} from "../utils";

interface BrowseFolderTabProps {
  folderConfig: FolderPathsConfig;
  onUpdateFolderConfig: (config: FolderPathsConfig) => void;
  downloadScope: DownloadScope;
  setDownloadScope: (scope: DownloadScope) => void;
  targetDownloadMods: ModStatus[];
  onDirectSyncToFolder: () => Promise<void>;
  isSyncing: boolean;
  isChecking: boolean;
  minecraftVersion: string;
  loader: string;
  lastSyncResults: FolderSyncFileResult[];
  directoryHandles: {
    root?: any;
    mods?: any;
    resourcepacks?: any;
    shaderpacks?: any;
  };
  onSelectDirectory: (type: "root" | "mods" | "resourcepacks" | "shaderpacks") => Promise<void>;
  onResetPaths: () => void;
}

export default function BrowseFolderTab({
  folderConfig,
  onUpdateFolderConfig,
  downloadScope,
  setDownloadScope,
  targetDownloadMods,
  onDirectSyncToFolder,
  isSyncing,
  isChecking,
  minecraftVersion,
  loader,
  lastSyncResults,
  directoryHandles,
  onSelectDirectory,
  onResetPaths
}: BrowseFolderTabProps) {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showScriptPreview, setShowScriptPreview] = useState<"bat" | "sh" | null>(null);

  const hasFsApi = typeof window !== "undefined" && "showDirectoryPicker" in window;

  const handleToggleAutoInstall = () => {
    onUpdateFolderConfig({
      ...folderConfig,
      autoInstallEnabled: !folderConfig.autoInstallEnabled
    });
  };

  const handleApplyPreset = (preset: LauncherPreset) => {
    onUpdateFolderConfig({
      ...folderConfig,
      baseMinecraftPath: preset.basePath,
      modsPath: preset.modsPath,
      resourcePacksPath: preset.resourcePacksPath,
      shadersPath: preset.shadersPath
    });
    setCopyFeedback(`Đã áp dụng đường dẫn ${preset.name}!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handlePasteFromClipboard = async (field: keyof FolderPathsConfig) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const trimmed = text.trim();
        const updated = { ...folderConfig, [field]: trimmed };
        // If baseMinecraftPath was pasted, auto-suggest subpaths
        if (field === "baseMinecraftPath") {
          const sep = trimmed.includes("/") ? "/" : "\\";
          const cleanBase = trimmed.endsWith(sep) ? trimmed.slice(0, -1) : trimmed;
          updated.modsPath = `${cleanBase}${sep}mods`;
          updated.resourcePacksPath = `${cleanBase}${sep}resourcepacks`;
          updated.shadersPath = `${cleanBase}${sep}shaderpacks`;
        }
        onUpdateFolderConfig(updated);
        setCopyFeedback("Đã dán đường dẫn từ Clipboard!");
        setTimeout(() => setCopyFeedback(null), 2500);
      }
    } catch {
      setCopyFeedback("Vui lòng cho phép quyền truy cập Clipboard trong trình duyệt.");
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const handleDownloadBatScript = () => {
    const batContent = generateAutoInstallBat(
      folderConfig.modsPath,
      folderConfig.resourcePacksPath,
      folderConfig.shadersPath
    );
    const blob = new Blob([batContent], { type: "application/x-bat;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AutoInstall_Minecraft_Mods.bat";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadShScript = () => {
    const shContent = generateAutoInstallSh(
      folderConfig.modsPath,
      folderConfig.resourcePacksPath,
      folderConfig.shadersPath
    );
    const blob = new Blob([shContent], { type: "application/x-sh;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auto_install_minecraft.sh";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modsCount = targetDownloadMods.filter(m => {
    const isShader = m.project?.project_type === "shader" || m.slug.includes("shader");
    const isRp = !isShader && (m.project?.project_type === "resourcepack" || m.latestFile?.filename?.endsWith(".zip"));
    return !isShader && !isRp;
  }).length;

  const rpCount = targetDownloadMods.filter(m => {
    const isShader = m.project?.project_type === "shader" || m.slug.includes("shader");
    return !isShader && (m.project?.project_type === "resourcepack" || m.latestFile?.filename?.endsWith(".zip"));
  }).length;

  const shaderCount = targetDownloadMods.filter(m => {
    return m.project?.project_type === "shader" || m.slug.includes("shader");
  }).length;

  return (
    <div className="space-y-6">
      {/* 1. HERO CARD: Auto-Install Switch & Status */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 transition-all p-6 sm:p-8 shadow-sm ${
          folderConfig.autoInstallEnabled
            ? "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-500/40 shadow-emerald-500/10"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span
                className={`p-2 rounded-xl flex items-center justify-center ${
                  folderConfig.autoInstallEnabled
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <HardDrive className="w-6 h-6" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                Tự Động Cài Đặt Vào Thư Mục Máy Tính (Browse & Auto-Sync)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Dán đường dẫn (link path) thư mục <code className="bg-gray-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono font-bold">mods</code>,{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-purple-800 font-mono font-bold">resourcepacks</code> và{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-amber-800 font-mono font-bold">shaderpacks</code>. Khi{" "}
              <strong>BẬT</strong> công tắc này, hệ thống sẽ tự động tải các tệp và lưu thẳng vào chính xác các thư mục tương ứng trên máy tính của bạn!
            </p>
          </div>

          {/* Large, Eye-catching Toggle Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/90 p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Chế độ tự động
              </span>
              <span
                className={`text-sm font-black flex items-center gap-1.5 ${
                  folderConfig.autoInstallEnabled ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {folderConfig.autoInstallEnabled ? (
                  <>
                    <Zap className="w-4 h-4 fill-emerald-500" />
                    ĐANG BẬT TỰ ĐỘNG CÀI
                  </>
                ) : (
                  "ĐANG TẮT (TẢI ZIP THƯỜNG)"
                )}
              </span>
            </div>

            <button
              onClick={handleToggleAutoInstall}
              type="button"
              role="switch"
              aria-checked={folderConfig.autoInstallEnabled}
              className={`relative inline-flex h-9 w-18 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                folderConfig.autoInstallEnabled ? "bg-emerald-600" : "bg-gray-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  folderConfig.autoInstallEnabled ? "translate-x-9 text-emerald-600" : "translate-x-0 text-gray-400"
                }`}
              >
                {folderConfig.autoInstallEnabled ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span className="text-[10px] font-black">OFF</span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Status notification ribbon */}
        {copyFeedback && (
          <div className="mt-4 p-2.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{copyFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. ACTION PANEL: Scope and Sync Now Button */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Chọn Phạm Vi Tệp Khi Tải Về Thư Mục
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Áp dụng bộ lọc cho các file sẽ được tự động cài đặt vào máy
            </p>
          </div>

          {/* Quick Scope selector buttons */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl">
            {(
              [
                { id: "all", label: "Tất Cả", icon: "📦" },
                { id: "performance", label: "Giảm Lag", icon: "⚡" },
                { id: "combat", label: "Súng TaCZ", icon: "⚔️" },
                { id: "visual", label: "Hoạt Ảnh 3D", icon: "✨" },
                { id: "packs_shaders", label: "Packs & Shaders", icon: "🎨" }
              ] as const
            ).map(item => (
              <button
                key={item.id}
                onClick={() => setDownloadScope(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 hover:cursor-pointer ${
                  downloadScope === item.id
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ready stats banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-emerald-600" />
                Thư mục mods/
              </span>
              <span className="bg-emerald-200/70 text-emerald-900 text-xs font-black px-2 py-0.5 rounded-full">
                {modsCount} file .jar
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-mono truncate mt-1.5" title={folderConfig.modsPath}>
              {folderConfig.modsPath}
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-purple-600" />
                Thư mục resourcepacks/
              </span>
              <span className="bg-purple-200/70 text-purple-900 text-xs font-black px-2 py-0.5 rounded-full">
                {rpCount} pack .zip
              </span>
            </div>
            <p className="text-[11px] text-purple-700 font-mono truncate mt-1.5" title={folderConfig.resourcePacksPath}>
              {folderConfig.resourcePacksPath}
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-600" />
                Thư mục shaderpacks/
              </span>
              <span className="bg-amber-200/70 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full">
                {shaderCount} shader .zip
              </span>
            </div>
            <p className="text-[11px] text-amber-700 font-mono truncate mt-1.5" title={folderConfig.shadersPath}>
              {folderConfig.shadersPath}
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onDirectSyncToFolder}
            disabled={isSyncing || isChecking || targetDownloadMods.length === 0}
            className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2.5 ${
              folderConfig.autoInstallEnabled
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white hover:shadow-emerald-500/25 hover:brightness-105 active:scale-[0.99] cursor-pointer"
                : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99] cursor-pointer"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSyncing ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>ĐANG TỰ ĐỘNG TẢI & GHI FILE VÀO THƯ MỤC MÁY TÍNH...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>
                  {folderConfig.autoInstallEnabled
                    ? `🚀 BẮT ĐẦU TẢI & CÀI ${targetDownloadMods.length} TỆP VÀO THƯ MỤC NGAY`
                    : `TẢI GÓI ZIP (${targetDownloadMods.length} TỆP) THEO CẤU TRÚC ĐÃ CHỌN`}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadBatScript}
            className="w-full sm:w-auto py-4 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            title="Tải kịch bản Windows .bat để copy file vào đúng 3 đường dẫn này chỉ bằng 1-Click"
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>Tải Kịch Bản Auto-Install (.bat)</span>
          </button>
        </div>
      </div>

      {/* 3. PATH INPUTS & PRESETS CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-150 pb-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              Cấu Hình Đường Dẫn (Link Path) Từng Thư Mục
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Nhập hoặc dán đường dẫn thư mục đích trên máy tính của bạn
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetPaths}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>
        </div>

        {/* Quick Launcher Presets */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Mẫu đường dẫn nhanh theo Launcher:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {LAUNCHER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all cursor-pointer group"
              >
                <div className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-gray-500 font-mono truncate mt-0.5">
                  {preset.basePath}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Base Minecraft Path (Quick updater) */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
              <span>🏠 Thư Mục Gốc .minecraft (Tự động điền 3 thư mục con bên dưới):</span>
            </label>
            <div className="flex items-center space-x-2">
              {hasFsApi && (
                <button
                  onClick={() => onSelectDirectory("root")}
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <FolderCheck className="w-3.5 h-3.5" />
                  <span>{directoryHandles.root ? "✓ Đã chọn thư mục máy" : "Chọn thư mục qua Browse..."}</span>
                </button>
              )}
              <button
                onClick={() => handlePasteFromClipboard("baseMinecraftPath")}
                className="text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Dán Path</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              value={folderConfig.baseMinecraftPath}
              onChange={(e) => {
                const val = e.target.value;
                const sep = val.includes("/") ? "/" : "\\";
                const cleanBase = val.endsWith(sep) ? val.slice(0, -1) : val;
                onUpdateFolderConfig({
                  ...folderConfig,
                  baseMinecraftPath: val,
                  modsPath: val ? `${cleanBase}${sep}mods` : folderConfig.modsPath,
                  resourcePacksPath: val ? `${cleanBase}${sep}resourcepacks` : folderConfig.resourcePacksPath,
                  shadersPath: val ? `${cleanBase}${sep}shaderpacks` : folderConfig.shadersPath
                });
              }}
              placeholder="%appdata%\.minecraft"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <p className="text-[11px] text-gray-500">
            Gõ hoặc dán đường dẫn thư mục gốc Minecraft tại đây, hệ thống sẽ tự động phân bổ đường dẫn cho 3 thư mục bên dưới.
          </p>
        </div>

        {/* 3 Detail Paths Inputs */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Path 1: Mods Folder */}
          <div className="p-4 border-2 border-emerald-100 bg-emerald-50/20 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-emerald-600" />
                <span>1. Thư mục Mods (.jar):</span>
              </label>
              <div className="flex items-center space-x-2">
                {hasFsApi && (
                  <button
                    onClick={() => onSelectDirectory("mods")}
                    className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{directoryHandles.mods ? "✓ Đã liên kết thư mục mods" : "Browse thư mục mods"}</span>
                  </button>
                )}
                <button
                  onClick={() => handlePasteFromClipboard("modsPath")}
                  className="text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dán</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={folderConfig.modsPath}
              onChange={(e) =>
                onUpdateFolderConfig({
                  ...folderConfig,
                  modsPath: e.target.value
                })
              }
              placeholder="%appdata%\.minecraft\mods"
              className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-emerald-700">
              Nơi lưu trữ tất cả các mod Fabric/Forge (Sodium, Chunky, Lithium, TaCZ Guns, v.v.).
            </p>
          </div>

          {/* Path 2: Resource Packs Folder */}
          <div className="p-4 border-2 border-purple-100 bg-purple-50/20 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-purple-600" />
                <span>2. Thư mục Resource Packs (.zip):</span>
              </label>
              <div className="flex items-center space-x-2">
                {hasFsApi && (
                  <button
                    onClick={() => onSelectDirectory("resourcepacks")}
                    className="text-[11px] font-bold text-purple-800 bg-purple-100/90 hover:bg-purple-200 border border-purple-300 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{directoryHandles.resourcepacks ? "✓ Đã liên kết resourcepacks" : "Browse resourcepacks"}</span>
                  </button>
                )}
                <button
                  onClick={() => handlePasteFromClipboard("resourcePacksPath")}
                  className="text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dán</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={folderConfig.resourcePacksPath}
              onChange={(e) =>
                onUpdateFolderConfig({
                  ...folderConfig,
                  resourcePacksPath: e.target.value
                })
              }
              placeholder="%appdata%\.minecraft\resourcepacks"
              className="w-full bg-white border border-purple-200 rounded-xl px-3.5 py-2 text-xs font-mono text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[11px] text-purple-700">
              Nơi lưu trữ các gói tài nguyên texture 3D, Fresh Animations, Bare Bones,...
            </p>
          </div>

          {/* Path 3: Shader Packs Folder */}
          <div className="p-4 border-2 border-amber-100 bg-amber-50/20 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-amber-600" />
                <span>3. Thư mục Shaders (.zip):</span>
              </label>
              <div className="flex items-center space-x-2">
                {hasFsApi && (
                  <button
                    onClick={() => onSelectDirectory("shaderpacks")}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{directoryHandles.shaderpacks ? "✓ Đã liên kết shaderpacks" : "Browse shaderpacks"}</span>
                  </button>
                )}
                <button
                  onClick={() => handlePasteFromClipboard("shadersPath")}
                  className="text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dán</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={folderConfig.shadersPath}
              onChange={(e) =>
                onUpdateFolderConfig({
                  ...folderConfig,
                  shadersPath: e.target.value
                })
              }
              placeholder="%appdata%\.minecraft\shaderpacks"
              className="w-full bg-white border border-amber-200 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-amber-700">
              Nơi lưu trữ các bộ shader đồ họa BSL, Complementary, MakeUp Ultra Fast,...
            </p>
          </div>
        </div>
      </div>

      {/* 4. SYNC RESULTS HISTORY (if any files synced) */}
      {lastSyncResults && lastSyncResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Kết Quả Ghi Vào Thư Mục Gần Nhất ({lastSyncResults.length} tệp)
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Đã ghi trực tiếp
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
            {lastSyncResults.map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-150"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      res.folder === "mods"
                        ? "bg-emerald-100 text-emerald-800"
                        : res.folder === "resourcepacks"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {res.folder}/
                  </span>
                  <span className="truncate text-gray-800 font-semibold">{res.filename}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 text-[11px]">
                  <span className="text-gray-500">{formatBytes(res.size, 1)}</span>
                  <span className="text-emerald-600 font-bold">✓ Đã lưu</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HELPFUL GUIDE CARD */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-300 rounded-2xl p-6 border border-gray-800 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Cách Hoạt Động & Bảo Mật Tuyệt Đối</span>
        </div>
        <p className="text-xs leading-relaxed text-gray-300">
          • <strong>Tự động ghi qua File System Access API:</strong> Trình duyệt sẽ yêu cầu bạn cấp quyền truy cập thư mục máy tính đúng 1 lần duy nhất để ghi file. Toàn bộ file mod được tải trực tiếp từ Modrinth/CurseForge CDN chính chủ về ổ đĩa của bạn.<br />
          • <strong>Dán Link Path:</strong> Bạn có thể sao chép đường dẫn từ File Explorer (Windows) hoặc Finder (Mac) và dán trực tiếp vào các ô phía trên. Nếu dùng script .bat/.sh, script sẽ đọc các đường dẫn này và tự sao chép chuẩn xác mà không sợ nhầm lẫn thư mục.
        </p>
      </div>
    </div>
  );
}
