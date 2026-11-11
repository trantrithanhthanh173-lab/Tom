import { useState, useMemo } from "react";
import { ModStatus, DownloadScope, FolderPathsConfig } from "../types";
import { formatBytes, isPerformanceMod, isModInScope, getScopeDisplayName } from "../utils";
import { Download, ExternalLink, CheckCircle2, AlertCircle, XCircle, RefreshCw, FolderArchive, Trash2, Search, X, Filter, Sparkles, Zap, Cog, Layers, SunMedium, ShieldCheck, Flame, HardDrive, FolderOpen } from "lucide-react";

interface ModTableProps {
  modStatuses: ModStatus[];
  isChecking: boolean;
  isDownloading?: boolean;
  provider?: "both" | "modrinth" | "curseforge";
  downloadScope: DownloadScope;
  setDownloadScope: (scope: DownloadScope) => void;
  onDownloadAll: (downloadAsZip: boolean, scope?: DownloadScope) => void;
  onRemoveMod?: (slug: string) => void;
  folderConfig?: FolderPathsConfig;
  onOpenBrowseTab?: () => void;
  onDirectSyncToFolder?: () => Promise<void>;
  isSyncing?: boolean;
}

export default function ModTable({
  modStatuses,
  isChecking,
  isDownloading = false,
  provider = "both",
  downloadScope,
  setDownloadScope,
  onDownloadAll,
  onRemoveMod,
  folderConfig,
  onOpenBrowseTab,
  onDirectSyncToFolder,
  isSyncing = false
}: ModTableProps) {
  const [downloadAsZip, setDownloadAsZip] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "core" | "visual" | "mechanics" | "resourcepack" | "shader" | "error">("all");

  const downloadableMods = useMemo(() => {
    return modStatuses.filter(m => m.latestFile?.url);
  }, [modStatuses]);

  const scopeReadyCounts = useMemo(() => {
    return {
      all: downloadableMods.length,
      performance: downloadableMods.filter(m => isPerformanceMod(m.slug)).length,
      visual: downloadableMods.filter(m => isModInScope(m.slug, "visual")).length,
      combat: downloadableMods.filter(m => isModInScope(m.slug, "combat")).length,
      packs_shaders: downloadableMods.filter(m => isModInScope(m.slug, "packs_shaders")).length,
    };
  }, [downloadableMods]);

  const targetDownloadMods = useMemo(() => {
    return downloadableMods.filter(m => isModInScope(m.slug, downloadScope));
  }, [downloadableMods, downloadScope]);

  const hasDownloadables = targetDownloadMods.length > 0;
  const isBusy = isChecking || isDownloading;

  // Calculate total download size based on active download scope
  const totalSizeBytes = useMemo(() => {
    return targetDownloadMods.reduce((acc, m) => acc + (m.latestFile?.size || 0), 0);
  }, [targetDownloadMods]);

  // Filtered mod statuses based on search query and category tab
  const filteredList = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    return modStatuses.filter((m) => {
      const project = m.project;
      const file = m.latestFile;
      const isShader = project?.project_type === "shader" || 
        m.slug.includes("shader") || 
        ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(m.slug);
      const isResourcePack = !isShader && (project?.project_type === "resourcepack" || file?.filename?.toLowerCase().endsWith(".zip") || [
        "fresh-animations", "fresh-moves", "fresh-food", "fresh-buckets", "fresh-music-discs", "fresh-flowers-and-plants", "refined-tools", "3d-default", "3d-vanilla-lite", "bare-bones", "motschens-better-leaves", "round-trees", "better-3d-blocks", "clean-connected-glass", "itembound-rebound", "just-3d-stuffs"
      ].includes(m.slug));
      const isMechanics = ["create", "valkyrien-skies", "clockwork", "eureka", "create-interactive", "immersive-portals", "terrablender"].includes(m.slug);
      const isCore = !isShader && !isResourcePack && !isMechanics;

      // Category matching
      if (activeCategory === "shader" && !isShader) return false;
      if (activeCategory === "resourcepack" && !isResourcePack) return false;
      if (activeCategory === "mechanics" && !isMechanics) return false;
      if (activeCategory === "core" && (!isCore || isMechanics)) return false;
      if (activeCategory === "error" && m.status !== "error") return false;

      // Search matching
      if (query) {
        const title = project?.title?.toLowerCase() || "";
        const desc = project?.description?.toLowerCase() || "";
        const slug = m.slug.toLowerCase();
        const filename = file?.filename?.toLowerCase() || "";
        return title.includes(query) || desc.includes(query) || slug.includes(query) || filename.includes(query);
      }

      return true;
    });
  }, [modStatuses, tableSearch, activeCategory]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden transition-all duration-200">
      {/* Top Header Bar */}
      <div className="px-6 py-4.5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center xl:justify-between bg-gradient-to-r from-gray-50/80 to-white gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Danh Sách Mods & Trạng Thái</h2>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
              provider === "both"
                ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                : provider === "curseforge"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}>
              {provider === "both"
                ? "Chế độ Both (Modrinth ➔ CurseForge)"
                : provider === "curseforge"
                ? "Nguồn CurseForge API"
                : "Nguồn Modrinth API"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Đã phát hiện <strong>{downloadableMods.length}</strong> tệp sẵn sàng. Mục tiêu đang chọn: <strong className="text-emerald-700">{getScopeDisplayName(downloadScope)}</strong> ({targetDownloadMods.length} tệp, ~{formatBytes(totalSizeBytes)}).
          </p>
        </div>

        {/* Global actions: Luôn luôn hiển thị, không ẩn sau hasDownloadables */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2.5 bg-white/95 border-2 border-emerald-500/20 shadow-xs rounded-2xl p-2 px-3 transition-all hover:border-emerald-500/40">
            
            {/* Scope Switcher Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100/90 p-1 rounded-xl border border-gray-250 shadow-inner overflow-x-auto max-w-full">
              {/* Tất Cả */}
              <button
                type="button"
                id="btn-download-mode-all"
                onClick={() => setDownloadScope("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  downloadScope === "all"
                    ? "bg-white text-gray-900 shadow-md ring-2 ring-emerald-500/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
                title="Chọn toàn bộ danh sách mods & packs"
              >
                <Layers className={`w-3.5 h-3.5 ${downloadScope === "all" ? "text-emerald-600" : "text-gray-500"}`} />
                <span>Tất Cả ({scopeReadyCounts.all})</span>
              </button>

              {/* Chỉ Mod Giảm Lag */}
              <button
                type="button"
                id="btn-download-mode-perf"
                onClick={() => setDownloadScope("performance")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  downloadScope === "performance"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md ring-2 ring-amber-400/40 scale-[1.02]"
                    : "text-amber-800 hover:bg-amber-50"
                }`}
                title="Chỉ tải các mod giảm lag và tối ưu hiệu năng (Sodium, Chunky, C2ME, Lithium...)"
              >
                <Zap className={`w-3.5 h-3.5 ${downloadScope === "performance" ? "text-amber-100 fill-amber-100 animate-pulse" : "text-amber-600"}`} />
                <span>Chỉ Giảm Lag ({scopeReadyCounts.performance})</span>
              </button>

              {/* Chỉ Hoạt Ảnh 3D */}
              <button
                type="button"
                id="btn-download-mode-visual"
                onClick={() => setDownloadScope("visual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  downloadScope === "visual"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md ring-2 ring-blue-400/40 scale-[1.02]"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
                title="Chỉ tải mod hoạt ảnh 3D & HUD (Eating, 3D Skin, WTHIT, Better Combat...)"
              >
                <Sparkles className={`w-3.5 h-3.5 ${downloadScope === "visual" ? "text-blue-100" : "text-blue-600"}`} />
                <span>Hoạt Ảnh 3D ({scopeReadyCounts.visual})</span>
              </button>

              {/* Chỉ Súng & Dao */}
              <button
                type="button"
                id="btn-download-mode-combat"
                onClick={() => setDownloadScope("combat")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  downloadScope === "combat"
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md ring-2 ring-rose-400/40 scale-[1.02]"
                    : "text-rose-700 hover:bg-rose-50"
                }`}
                title="Chỉ tải Súng TaCZ và Dao Valorant/CS"
              >
                <Flame className={`w-3.5 h-3.5 ${downloadScope === "combat" ? "text-rose-100" : "text-rose-600"}`} />
                <span>Súng & Dao ({scopeReadyCounts.combat})</span>
              </button>

              {/* Chỉ Gói 3D & Shaders */}
              <button
                type="button"
                id="btn-download-mode-packs-shaders"
                onClick={() => setDownloadScope("packs_shaders")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  downloadScope === "packs_shaders"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-400/40 scale-[1.02]"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
                title="Chỉ tải Resource Packs 3D & Shaders"
              >
                <SunMedium className={`w-3.5 h-3.5 ${downloadScope === "packs_shaders" ? "text-purple-100" : "text-purple-600"}`} />
                <span>Gói 3D & Shaders ({scopeReadyCounts.packs_shaders})</span>
              </button>
            </div>

            <div className="w-[1px] h-6 bg-gray-200 hidden lg:block"></div>

            {/* Checkbox ZIP */}
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors">
              <input
                type="checkbox"
                id="checkbox-download-zip"
                checked={downloadAsZip}
                onChange={(e) => setDownloadAsZip(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer transition-all"
              />
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <FolderArchive className="w-4 h-4 text-emerald-600" />
                Nén file ZIP
              </span>
            </label>
            
            <div className="w-[1px] h-6 bg-gray-200 hidden lg:block"></div>

            {/* Download Action Button */}
            <button
              id="btn-download-all-mods"
              onClick={() => onDownloadAll(downloadAsZip, downloadScope)}
              disabled={isBusy || targetDownloadMods.length === 0}
              className={`inline-flex items-center space-x-2 text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow-xs transition-all hover:cursor-pointer interactive-button whitespace-nowrap ${
                isBusy || targetDownloadMods.length === 0
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : downloadScope === "performance"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white ring-2 ring-amber-400/40 shadow-amber-600/30"
                  : downloadScope === "visual"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white ring-2 ring-blue-400/40 shadow-blue-600/30"
                  : downloadScope === "combat"
                  ? "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white ring-2 ring-rose-400/40 shadow-rose-600/30"
                  : downloadScope === "packs_shaders"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white ring-2 ring-purple-400/40 shadow-purple-600/30"
                  : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white shadow-gray-900/20"
              }`}
              title={
                targetDownloadMods.length === 0
                  ? "Chưa có file sẵn sàng. Vui lòng bấm Kiểm Tra ở khung bên trái."
                  : downloadAsZip
                  ? `Tải xuống ${targetDownloadMods.length} tệp đóng gói trong 1 tệp ZIP`
                  : `Tải xuống ${targetDownloadMods.length} tệp rời`
              }
            >
              {isDownloading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {isDownloading
                  ? downloadAsZip
                    ? "Đang nén ZIP..."
                    : "Đang tải..."
                  : targetDownloadMods.length === 0
                  ? "Chưa có tệp (Hãy Kiểm Tra Link)"
                  : `${downloadAsZip ? "Tải File ZIP" : "Tải Tệp Rời"}: ${getScopeDisplayName(downloadScope)} (${targetDownloadMods.length})`}
              </span>
            </button>

            {/* Direct Folder Install button if Auto-Install is ON */}
            {folderConfig?.autoInstallEnabled && onDirectSyncToFolder && (
              <button
                type="button"
                onClick={onDirectSyncToFolder}
                disabled={isBusy || targetDownloadMods.length === 0 || isSyncing}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-xs hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                title="Tự động tải và ghi thẳng vào thư mục máy tính đã cấu hình"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <HardDrive className="w-4 h-4" />
                )}
                <span>Cài Thẳng Vào Máy</span>
              </button>
            )}
          </div>

          {isChecking && (
            <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold border border-emerald-200 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Đang quét tệp...</span>
            </span>
          )}
        </div>
      </div>

      {/* Auto-install mode banner in ModTable */}
      {folderConfig?.autoInstallEnabled && (
        <div className="mx-6 mt-3 px-3.5 py-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center space-x-2 truncate">
            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-extrabold flex-shrink-0">Tự động tải vào thư mục đang BẬT:</span>
            <code className="font-mono text-[11px] bg-white/90 border border-emerald-200 px-2 py-0.5 rounded text-emerald-900 truncate" title={folderConfig.modsPath}>
              {folderConfig.modsPath}
            </code>
          </div>
          {onOpenBrowseTab && (
            <button
              onClick={onOpenBrowseTab}
              className="font-extrabold text-emerald-700 hover:text-emerald-900 underline text-xs flex-shrink-0 ml-3 flex items-center gap-1 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Chỉnh đường dẫn &rarr;</span>
            </button>
          )}
        </div>
      )}


      {/* Filter and Search Bar for Table */}
      <div className="px-6 py-3 bg-gray-50/70 border-b border-gray-200/70 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all hover:cursor-pointer ${
              activeCategory === "all"
                ? "bg-gray-900 text-white shadow-2xs"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Tất cả ({modStatuses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("core")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:cursor-pointer flex items-center gap-1 ${
              activeCategory === "core"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Hiệu Năng & Cốt Lõi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("mechanics")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:cursor-pointer flex items-center gap-1 ${
              activeCategory === "mechanics"
                ? "bg-sky-600 text-white shadow-2xs"
                : "bg-white text-sky-800 border border-sky-200 hover:bg-sky-50"
            }`}
          >
            <Cog className="w-3 h-3" />
            <span>Cơ Khí & Tàu Bay</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("resourcepack")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:cursor-pointer flex items-center gap-1 ${
              activeCategory === "resourcepack"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-white text-purple-800 border border-purple-200 hover:bg-purple-50"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Resource Packs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("shader")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:cursor-pointer flex items-center gap-1 ${
              activeCategory === "shader"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <SunMedium className="w-3 h-3" />
            <span>Shaders</span>
          </button>
        </div>

        {/* Search input in table */}
        <div className="relative flex items-center min-w-[240px]">
          <div className="absolute left-2.5 pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Lọc nhanh mod trong bảng..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full text-xs bg-white border border-gray-250 rounded-lg pl-8 pr-7 py-1.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all shadow-2xs"
          />
          {tableSearch && (
            <button
              type="button"
              onClick={() => setTableSearch("")}
              className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5 hover:cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Structured ZIP Preview Card */}
      {hasDownloadables && downloadAsZip && (
        <div className="mx-6 my-4 p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <span className="text-2xl flex-shrink-0">
              {downloadScope === "performance" ? "⚡" : downloadScope === "combat" ? "⚔️" : downloadScope === "visual" ? "✨" : downloadScope === "packs_shaders" ? "🎨" : "📦"}
            </span>
            <div className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <p className="font-extrabold text-emerald-950 text-sm">
                    {downloadScope === "performance"
                      ? "Gói ZIP Tối Ưu Hiệu Năng & Giảm Lag:"
                      : downloadScope === "combat"
                      ? "Gói ZIP Súng TaCZ & Vũ Khí Melee:"
                      : downloadScope === "visual"
                      ? "Gói ZIP Hoạt Ảnh 3D & Giao Diện:"
                      : downloadScope === "packs_shaders"
                      ? "Gói ZIP Resource Packs & Shaders:"
                      : "Cấu trúc tệp ZIP khi tải về (Đã phân 3 thư mục chuẩn Minecraft):"}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    downloadScope === "performance"
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-emerald-200/70 text-emerald-900"
                  }`}>
                    {`Chế độ: ${targetDownloadMods.length} Tệp (${getScopeDisplayName(downloadScope)})`}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  1-Click Giải Nén
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2.5">
                <div className="bg-white/90 border border-emerald-200/90 p-3 rounded-xl shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800 text-xs mb-1">
                    <span>📁 Thư mục 1:</span>
                    <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-900 font-bold">mods/</code>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {downloadScope === "performance"
                      ? "Các tệp .jar tối ưu FPS, RAM, CPU & World (Sodium, Chunky, Lithium, FerriteCore, EntityCulling...)."
                      : downloadScope === "combat"
                      ? "Các tệp .jar súng TaCZ, LesRaisins, phụ kiện và dao melee."
                      : downloadScope === "packs_shaders"
                      ? "Không tải (chỉ tải Resource Packs và Shaders)."
                      : "Toàn bộ tệp .jar (Fabric API, Sodium, TaCZ, Eating Animation, Create,...)."}
                  </p>
                </div>
                <div className={`bg-white/90 border p-3 rounded-xl shadow-2xs hover:shadow-xs transition-shadow ${
                  downloadScope === "performance" || downloadScope === "combat" ? "border-gray-200 opacity-60" : "border-purple-200/90"
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold text-purple-800 text-xs mb-1">
                    <span>🎨 Thư mục 2:</span>
                    <code className="bg-purple-100 px-1.5 py-0.5 rounded font-mono text-purple-900 font-bold">resourcepacks/</code>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {downloadScope === "performance" || downloadScope === "combat"
                      ? "Không tải (đã lọc theo phạm vi tương ứng)."
                      : "Tệp gói tài nguyên .zip (Fresh Animations, Fresh Food, Refined Tools, Bare Bones...)."}
                  </p>
                </div>
                <div className={`bg-white/90 border p-3 rounded-xl shadow-2xs hover:shadow-xs transition-shadow ${
                  downloadScope === "performance" || downloadScope === "combat" ? "border-gray-200 opacity-60" : "border-amber-200/90"
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold text-amber-800 text-xs mb-1">
                    <span>✨ Thư mục 3:</span>
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-bold">shaderpacks/</code>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {downloadScope === "performance" || downloadScope === "combat"
                      ? "Không tải (đã lọc theo phạm vi tương ứng)."
                      : "Tệp Shaders đồ họa .zip (BSL, Complementary Reimagined, Sildur's Vibrant...)."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50/90 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-3.5">Tên / Phân Loại</th>
              <th className="px-6 py-3.5">Loại Tệp</th>
              <th className="px-6 py-3.5">Phiên Bản Tìm Thấy</th>
              <th className="px-6 py-3.5">Trạng Thái Quét</th>
              <th className="px-6 py-3.5 text-right">Tải Tệp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-xs">
                  Không tìm thấy mod nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredList.map((m) => {
                const project = m.project;
                const version = m.latestCompatibleVersion;
                const file = m.latestFile;
                const isShader = project?.project_type === "shader" || 
                  m.slug.includes("shader") || 
                  ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(m.slug);
                const isResourcePack = !isShader && (project?.project_type === "resourcepack" || file?.filename?.toLowerCase().endsWith(".zip") || [
                  "fresh-animations", "fresh-moves", "fresh-food", "fresh-buckets", "fresh-music-discs", "fresh-flowers-and-plants", "refined-tools", "3d-default", "3d-vanilla-lite", "bare-bones", "motschens-better-leaves", "round-trees", "better-3d-blocks", "clean-connected-glass", "itembound-rebound", "just-3d-stuffs"
                ].includes(m.slug));

                return (
                  <tr key={m.slug} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                    {/* Mod name & description */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200/90 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                          {project?.icon_url ? (
                            <img
                              src={project.icon_url}
                              alt={m.slug}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-xs font-mono font-black text-gray-400 uppercase">
                              {m.slug.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="max-w-[280px]">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-gray-900 truncate max-w-[190px] group-hover:text-emerald-700 transition-colors">
                              {project?.title || m.slug}
                            </span>
                            {(() => {
                              const isCurseForge = m.sourceProvider === "curseforge" || (provider === "curseforge" && m.sourceProvider !== "modrinth") || m.slug === "shine-vfx" || m.slug === "shine";
                              const effectiveSlug = project?.slug || m.slug;
                              const externalUrl = isCurseForge
                                ? isShader
                                  ? `https://www.curseforge.com/minecraft/shaders/${effectiveSlug}`
                                  : isResourcePack
                                  ? `https://www.curseforge.com/minecraft/texture-packs/${effectiveSlug}`
                                  : `https://www.curseforge.com/minecraft/mc-mods/${effectiveSlug}`
                                : `https://modrinth.com/${isShader ? "shader" : isResourcePack ? "resourcepack" : "mod"}/${effectiveSlug}`;
                              const providerLabel = isCurseForge ? "CurseForge" : "Modrinth";

                              return (
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={externalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-block transition-colors ${
                                      isCurseForge
                                        ? "text-amber-600 hover:text-amber-800"
                                        : "text-gray-400 hover:text-emerald-600"
                                    }`}
                                    title={`Xem trang chi tiết trên ${providerLabel}`}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                  {provider === "both" && m.sourceProvider && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                      m.sourceProvider === "curseforge"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    }`}>
                                      {m.sourceProvider === "curseforge" ? "CF" : "MR"}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5" title={project?.description}>
                            {project?.description || m.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type Tag */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isShader ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 inline-flex items-center gap-1">
                          <span>✨ Shader</span>
                        </span>
                      ) : isResourcePack ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 inline-block">
                          🎨 Resource Pack
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 inline-block">
                          📦 Mod (.jar)
                        </span>
                      )}
                    </td>

                    {/* Version & File Info */}
                    <td className="px-6 py-4">
                      {version ? (
                        <div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <p className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                              {version.version_number}
                            </p>
                            {version.version_type === "release" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200" title="Bản chính thức ổn định (Release)">
                                Release
                              </span>
                            ) : version.version_type === "beta" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200" title="Bản thử nghiệm Beta">
                                Beta
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200" title="Bản thử nghiệm Alpha">
                                Alpha
                              </span>
                            )}
                          </div>
                          {file && (
                            <p className="text-[11px] text-gray-400 mt-1 truncate max-w-[200px]" title={file.filename}>
                              {file.filename} ({formatBytes(file.size)})
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs font-mono">-</span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {m.status === "idle" && (
                        <span className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                          <span>Chờ quét</span>
                        </span>
                      )}
                      {m.status === "checking" && (
                        <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold animate-pulse border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                          <span>Đang kiểm tra...</span>
                        </span>
                      )}
                      {m.status === "success" && (
                        <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Khả dụng</span>
                        </span>
                      )}
                      {m.status === "warning" && (
                        <span className="inline-flex items-center space-x-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold shadow-2xs">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Cảnh báo</span>
                        </span>
                      )}
                      {m.status === "error" && (
                        <span className="inline-flex items-center space-x-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-bold shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Không có tệp</span>
                        </span>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] truncate" title={m.message}>
                        {m.message}
                      </p>
                    </td>

                    {/* Actions: Download + Delete */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {file ? (
                          <a
                            href={`/api/download-proxy?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.filename || (isShader ? "shader.zip" : isResourcePack ? "pack.zip" : "mod.jar"))}`}
                            target="_blank"
                            id={`dl-link-${m.slug}`}
                            className={`inline-flex items-center space-x-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all duration-150 interactive-button hover:cursor-pointer ${
                              isShader
                                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                                : isResourcePack
                                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                            }`}
                            title={`Tải xuống ${file.filename}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isShader ? "Tải Shader" : isResourcePack ? "Tải ZIP" : "Tải JAR"}</span>
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-lg cursor-not-allowed"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Không có</span>
                          </button>
                        )}

                        {onRemoveMod && (
                          <button
                            type="button"
                            onClick={() => onRemoveMod(m.slug)}
                            disabled={isBusy}
                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed interactive-button"
                            title={`Xóa '${m.slug}' khỏi danh sách`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

