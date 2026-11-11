import { useState, FormEvent, ChangeEvent, useMemo } from "react";
import { MINECRAFT_VERSIONS, DEFAULT_MODS, DEFAULT_RESOURCE_PACKS, DEFAULT_SHADERS, resolveModSlug, getMissingDependencies, isPerformanceMod, isModInScope, getScopeDisplayName } from "../utils";
import { ReleaseChannel, DownloadScope, FolderPathsConfig } from "../types";
import { Plus, Trash2, RotateCcw, Play, Sparkles, Zap, Layers, Link as LinkIcon, SunMedium, AlertTriangle, CheckCircle2, Wrench, Search, X, Cog, ShieldCheck, Flame, Download, FolderArchive, HardDrive, FolderOpen } from "lucide-react";

interface ModConfigPanelProps {
  minecraftVersion: string;
  setMinecraftVersion: (v: string) => void;
  loader: "fabric" | "forge";
  setLoader: (l: "fabric" | "forge") => void;
  mods: string[];
  provider: "both" | "modrinth" | "curseforge";
  setProvider: (p: "both" | "modrinth" | "curseforge") => void;
  releaseChannel: ReleaseChannel;
  setReleaseChannel: (rc: ReleaseChannel) => void;
  onAddMod: (slug: string) => void;
  onRemoveMod: (slug: string) => void;
  onResetMods: () => void;
  onRunCheck: (scope?: DownloadScope) => void;
  isChecking: boolean;
  downloadScope: DownloadScope;
  setDownloadScope: (scope: DownloadScope) => void;
  onDownloadScope: (downloadAsZip: boolean, scope?: DownloadScope) => void;
  downloadableModsCount: number;
  isDownloading?: boolean;
  folderConfig?: FolderPathsConfig;
  onOpenBrowseTab?: () => void;
}

export default function ModConfigPanel({
  minecraftVersion,
  setMinecraftVersion,
  loader,
  setLoader,
  mods,
  provider,
  setProvider,
  releaseChannel,
  setReleaseChannel,
  onAddMod,
  onRemoveMod,
  onResetMods,
  onRunCheck,
  isChecking,
  downloadScope,
  setDownloadScope,
  onDownloadScope,
  downloadableModsCount,
  isDownloading = false,
  folderConfig,
  onOpenBrowseTab
}: ModConfigPanelProps) {
  const [newModInput, setNewModInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customVersionActive, setCustomVersionActive] = useState(false);
  const [customVersion, setCustomVersion] = useState("");
  const [downloadAsZip, setDownloadAsZip] = useState(true);

  const scopeCounts = useMemo(() => {
    return {
      all: mods.length,
      performance: mods.filter(m => isPerformanceMod(m)).length,
      visual: mods.filter(m => isModInScope(m, "visual")).length,
      combat: mods.filter(m => isModInScope(m, "combat")).length,
      packs_shaders: mods.filter(m => isModInScope(m, "packs_shaders")).length,
    };
  }, [mods]);

  const currentScopeCount = scopeCounts[downloadScope] ?? mods.length;

  const missingDeps = getMissingDependencies(mods);

  const handleAutoFixAllDependencies = () => {
    missingDeps.forEach((dep) => {
      dep.missing.forEach((m) => {
        onAddMod(m.slug);
      });
    });
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const raw = newModInput.trim();
    if (raw) {
      const resolved = resolveModSlug(raw);
      if (resolved) {
        onAddMod(resolved);
        setNewModInput("");
      }
    }
  };

  const handleVersionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setCustomVersion(MINECRAFT_VERSIONS.includes(minecraftVersion) ? "" : minecraftVersion);
      setCustomVersionActive(true);
    } else {
      setCustomVersionActive(false);
      setMinecraftVersion(val);
    }
  };

  const handleCustomVersionSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = customVersion.trim();
    if (clean) {
      setMinecraftVersion(clean);
      setCustomVersionActive(false);
    }
  };

  const handleAddVisualBundle = () => {
    const visualSlugs = [
      "entity-model-features",
      "entitytexturefeatures",
      "eating-animation",
      "3dskinlayers",
      "emotecraft",
      "first-person-model",
      "playeranimator",
      "custom-player-models",
      "epic-fight",
      "countereds-accurate-hitboxes",
      "visuality",
      "effective"
    ];
    visualSlugs.forEach(s => onAddMod(s));
  };

  const handleAddResourcePacksBundle = () => {
    DEFAULT_RESOURCE_PACKS.forEach(rp => onAddMod(rp.id));
  };

  const handleAddShadersBundle = () => {
    DEFAULT_SHADERS.forEach(sh => onAddMod(sh.id));
  };

  const handleAddPhysicsCreateBundle = () => {
    const physicsMods = [
      "terrablender",
      "valkyrien-skies",
      "clockwork",
      "eureka",
      "create-interactive",
      "create",
      "immersive-portals"
    ];
    physicsMods.forEach(m => onAddMod(m));
  };

  const handleAddTaCZGunBundle = () => {
    const gunCombatMods = [
      "tacz",
      "lesraisins-tactical-equipements",
      "tacz-lr-valorant-knife-pack",
      "tacz-cs-default-knife",
      "tacz-lr-arena-breakout-infinite-melee-pack"
    ];
    gunCombatMods.forEach(m => onAddMod(m));
  };

  const handleAddKaleidoscopeBundle = () => {
    const culinaryMods = [
      "kaleidoscope-cookery",
      "kaleidoscope-immersive-eating"
    ];
    culinaryMods.forEach(m => onAddMod(m));
  };

  const handleAddFullCombo = () => {
    DEFAULT_MODS.forEach(m => onAddMod(m.id));
    DEFAULT_RESOURCE_PACKS.forEach(rp => onAddMod(rp.id));
    DEFAULT_SHADERS.forEach(sh => onAddMod(sh.id));
  };

  const quickPills = [
    { slug: "wthit", label: "🔍 WTHIT (HUD)" },
    { slug: "geckolib", label: "🦎 GeckoLib" },
    { slug: "better-combat", label: "⚔️ Better Combat" },
    { slug: "tacz", label: "🔫 TaCZ Guns" },
    { slug: "lesraisins-tactical-equipements", label: "🛡️ LesRaisins Tactical" },
    { slug: "tacz-lr-valorant-knife-pack", label: "🗡️ Valorant Knife" },
    { slug: "tacz-cs-default-knife", label: "🔪 CS Default Knife" },
    { slug: "tacz-lr-arena-breakout-infinite-melee-pack", label: "🪓 Arena Breakout Melee" },
    { slug: "kaleidoscope-cookery", label: "🍳 Kaleidoscope Cookery" },
    { slug: "kaleidoscope-immersive-eating", label: "🍽️ Immersive Eating" },
    { slug: "modmenu", label: "📋 Mod Menu" },
    { slug: "cloth-config", label: "⚙️ Cloth Config" },
    { slug: "sodium", label: "⚡ Sodium" },
    { slug: "sodium-extra", label: "⚡ Sodium Extra" },
    { slug: "iris", label: "✨ Iris (Shader Loader)" },
    { slug: "photonics", label: "🔦 Photonics (Raytracing)" },
    { slug: "visuality", label: "✨ Visuality" },
    { slug: "kotlin-for-forge", label: "☕ Kotlin for Forge" },
    { slug: "fabric-language-kotlin", label: "☕ Fabric Kotlin" },
    { slug: "terrablender", label: "🗺️ TerraBlender" },
    { slug: "valkyrien-skies", label: "🚢 Valkyrien Skies" },
    { slug: "clockwork", label: "⚙️ VS: Clockwork" },
    { slug: "eureka", label: "⛵ Eureka! Ships!" },
    { slug: "create-interactive", label: "🔧 Create: Interactive" },
    { slug: "create", label: "⚙️ Create Mod" },
    { slug: "immersive-portals", label: "🌀 Immersive Portals" },
    { slug: "falldrop-backport", label: "🍃 Falldrop Backport" },
    { slug: "shine-vfx", label: "✨ Shine: VFX (CurseForge)" },
    { slug: "chunky-pregenerator", label: "🗺️ Chunky Pregen (CurseForge)" },
    { slug: "do-a-barrel-roll", label: "✈️ Do a Barrel Roll" },
    { slug: "zoomify", label: "🔍 Zoomify" },
    { slug: "gamma-utils", label: "💡 Gamma Utils" },
    { slug: "better-f1", label: "🎬 Better F1" },
    { slug: "betterf3", label: "📊 BetterF3" },
    { slug: "flashback", label: "🎥 Flashback Replay" },
    { slug: "freecam", label: "🕊️ Freecam" },
    { slug: "skin-shuffle", label: "👕 SkinShuffle" },
    { slug: "yacl", label: "⚙️ YACL" },
    { slug: "entitytexturefeatures", label: "ETF (Texture)" },
    { slug: "entity-model-features", label: "EMF (CEM 3D)" },
    { slug: "eating-animation", label: "Eating Animation" },
    { slug: "3dskinlayers", label: "3D Skin Layers" },
    { slug: "emotecraft", label: "🎭 Emotecraft" },
    { slug: "first-person-model", label: "👁️ First-Person Model" },
    { slug: "playeranimator", label: "🏃 Player Animator" },
    { slug: "player-animation-library", label: "🏃 Player Animation Library (PAL)" },
    { slug: "custom-player-models", label: "🧍 Customizable Player Models (CPM)" },
    { slug: "epic-fight", label: "⚔️ Epic Fight Mod" },
    { slug: "countereds-accurate-hitboxes", label: "🎯 Accurate Hitboxes (Hitbox 3D)" },
    { slug: "effective", label: "Effective" },
    { slug: "appleskin", label: "🍎 AppleSkin" },
    { slug: "bsl-shaders", label: "☀️ BSL Shaders", isShader: true },
    { slug: "complementary-reimagined", label: "🌅 Complementary Reimagined", isShader: true },
    { slug: "makeup-ultra-fast", label: "⚡ MakeUp Ultra Fast", isShader: true },
    { slug: "sildurs-vibrant-shaders", label: "✨ Sildur's Vibrant", isShader: true },
    { slug: "fresh-animations", label: "🎨 Fresh Animations", isPack: true },
    { slug: "fresh-moves", label: "🏃 Fresh Moves", isPack: true },
    { slug: "fresh-food", label: "🍔 Fresh Food 3D", isPack: true },
    { slug: "fresh-buckets", label: "🪣 Fresh Buckets 3D", isPack: true },
    { slug: "fresh-music-discs", label: "💿 Fresh Music Discs", isPack: true },
    { slug: "fresh-flowers-and-plants", label: "🌻 Fresh Flowers & Plants", isPack: true },
    { slug: "refined-tools", label: "⚔️ Refined Tools 3D", isPack: true },
    { slug: "3d-default", label: "🎨 3D Default", isPack: true },
    { slug: "3d-vanilla-lite", label: "🧊 3D Vanilla Lite", isPack: true },
    { slug: "bare-bones", label: "🎨 Bare Bones", isPack: true },
    { slug: "motschens-better-leaves", label: "🌿 Better Leaves (Lá 3D)", isPack: true },
    { slug: "round-trees", label: "🌳 Round Trees (Cây tròn 3D)", isPack: true },
    { slug: "better-3d-blocks", label: "🧱 Better 3D Blocks", isPack: true },
    { slug: "clean-connected-glass", label: "🎨 Clean Glass", isPack: true }
  ];

  // Search filter and existence lookup
  const cleanSearchQuery = searchQuery.trim().toLowerCase();
  const resolvedSearchSlug = cleanSearchQuery ? resolveModSlug(cleanSearchQuery) : "";

  const searchStatus = useMemo(() => {
    if (!cleanSearchQuery) return null;
    const isExactPresent = mods.includes(resolvedSearchSlug) || mods.includes(cleanSearchQuery);
    const matchedMods = mods.filter(m => m.toLowerCase().includes(cleanSearchQuery) || m.toLowerCase().includes(resolvedSearchSlug));
    
    // Find preset info if available
    const allPresets = [...DEFAULT_MODS, ...DEFAULT_RESOURCE_PACKS, ...DEFAULT_SHADERS];
    const preset = allPresets.find(p => p.id === resolvedSearchSlug || p.id.includes(cleanSearchQuery));

    return {
      query: cleanSearchQuery,
      resolvedSlug: resolvedSearchSlug,
      isExactPresent,
      matchCount: matchedMods.length,
      matchedMods,
      presetName: preset?.name || resolvedSearchSlug
    };
  }, [cleanSearchQuery, resolvedSearchSlug, mods]);

  const filteredMods = useMemo(() => {
    if (!cleanSearchQuery) return mods;
    return mods.filter(m => 
      m.toLowerCase().includes(cleanSearchQuery) || 
      m.toLowerCase().includes(resolvedSearchSlug)
    );
  }, [mods, cleanSearchQuery, resolvedSearchSlug]);

  return (
    <div className="bg-white rounded-xl border border-gray-150 shadow-xs p-6 flex flex-col space-y-6">
      {/* Target Minecraft Version */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-900">
            Phiên Bản Minecraft
          </label>
          {!MINECRAFT_VERSIONS.includes(minecraftVersion) && !customVersionActive && (
            <button
              type="button"
              onClick={() => {
                setCustomVersion(minecraftVersion);
                setCustomVersionActive(true);
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline flex items-center gap-1 hover:cursor-pointer"
            >
              <span>✏️ Sửa bản tùy chỉnh ({minecraftVersion})</span>
            </button>
          )}
        </div>

        {customVersionActive ? (
          <form onSubmit={handleCustomVersionSubmit} className="flex space-x-2">
            <input
              type="text"
              required
              autoFocus
              placeholder="Ví dụ: 1.12.2, 1.20.1, 24w..."
              value={customVersion}
              onChange={(e) => setCustomVersion(e.target.value)}
              className="flex-1 text-sm bg-white border border-emerald-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs hover:cursor-pointer"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={() => setCustomVersionActive(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors hover:cursor-pointer"
            >
              Hủy
            </button>
          </form>
        ) : (
          <div className="flex items-center space-x-2">
            <select
              value={minecraftVersion}
              onChange={handleVersionChange}
              className="flex-1 text-sm bg-white border border-gray-250 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden hover:cursor-pointer font-medium text-gray-800"
            >
              {!MINECRAFT_VERSIONS.includes(minecraftVersion) && (
                <option value={minecraftVersion}>
                  ⭐ Phiên bản tự nhập: Minecraft {minecraftVersion}
                </option>
              )}
              {MINECRAFT_VERSIONS.map((v) => (
                <option key={v} value={v}>
                  Minecraft {v}
                </option>
              ))}
              <option value="__custom__">➕ Nhập phiên bản khác...</option>
            </select>

            <button
              type="button"
              title="Nhập phiên bản tùy chỉnh khác"
              onClick={() => {
                setCustomVersion(MINECRAFT_VERSIONS.includes(minecraftVersion) ? "" : minecraftVersion);
                setCustomVersionActive(true);
              }}
              className="px-2.5 py-2.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-250 rounded-lg transition-colors whitespace-nowrap hover:cursor-pointer flex items-center gap-1"
            >
              <span>✏️ Nhập tay</span>
            </button>
          </div>
        )}
      </div>

      {/* Loader configuration */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Mod Loader
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLoader("fabric")}
            className={`flex items-center justify-center space-x-2 p-2.5 rounded-lg border text-xs font-semibold transition-all hover:cursor-pointer ${
              loader === "fabric"
                ? "bg-purple-50 border-purple-200 text-purple-700 ring-2 ring-purple-100"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${loader === "fabric" ? "bg-purple-500" : "bg-gray-300"}`}></span>
            <span>Fabric</span>
          </button>
          <button
            type="button"
            onClick={() => setLoader("forge")}
            className={`flex items-center justify-center space-x-2 p-2.5 rounded-lg border text-xs font-semibold transition-all hover:cursor-pointer ${
              loader === "forge"
                ? "bg-orange-50 border-orange-200 text-orange-700 ring-2 ring-orange-100"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${loader === "forge" ? "bg-orange-500" : "bg-gray-300"}`}></span>
            <span>Forge</span>
          </button>
        </div>
      </div>

      {/* Provider Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">
            Nguồn Tải (Provider)
          </label>
          <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
            {provider === "both" ? "✨ Tự chuyển thông minh" : "✓ Đồng bộ nguồn"}
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          {/* Both Mode */}
          <button
            type="button"
            onClick={() => setProvider("both")}
            className={`w-full flex items-start space-x-3 p-3 rounded-xl border text-left transition-all hover:cursor-pointer ${
              provider === "both"
                ? "bg-indigo-50/90 border-indigo-400 text-indigo-950 ring-2 ring-indigo-200 shadow-2xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="provider-select"
              checked={provider === "both"}
              onChange={() => setProvider("both")}
              className="mt-1 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-950">Both (Modrinth & CurseForge)</span>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">Khuyên Dùng</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                Ưu tiên Modrinth, nếu thiếu mod/file sẽ tự động tìm tiếp trên CurseForge.
              </p>
            </div>
          </button>

          {/* Modrinth Only */}
          <button
            type="button"
            onClick={() => setProvider("modrinth")}
            className={`w-full flex items-start space-x-3 p-3 rounded-xl border text-left transition-all hover:cursor-pointer ${
              provider === "modrinth"
                ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200 shadow-2xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="provider-select"
              checked={provider === "modrinth"}
              onChange={() => setProvider("modrinth")}
              className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-950">Chỉ Modrinth API</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">Tải Nhanh</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                Tải trực tiếp qua Modrinth API, tốc độ cao & tối ưu cho Fabric / Quilt.
              </p>
            </div>
          </button>

          {/* CurseForge Only */}
          <button
            type="button"
            onClick={() => setProvider("curseforge")}
            className={`w-full flex items-start space-x-3 p-3 rounded-xl border text-left transition-all hover:cursor-pointer ${
              provider === "curseforge"
                ? "bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-200 shadow-2xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="provider-select"
              checked={provider === "curseforge"}
              onChange={() => setProvider("curseforge")}
              className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-950">Chỉ CurseForge API</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">Kho Mod Lớn</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                Quét và tải trực tiếp 100% qua CurseForge Backend Proxy.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Release Channel Selector (Release vs Beta) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">
            Kênh Tải Phiên Bản (Release Channel)
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Release Channel (Default) */}
          <button
            type="button"
            onClick={() => setReleaseChannel("release")}
            className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer ${
              releaseChannel === "release"
                ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200 shadow-2xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="release-channel-select"
              checked={releaseChannel === "release"}
              onChange={() => setReleaseChannel("release")}
              className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold flex items-center gap-1 text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">Release</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight truncate">
                Ổn định nhất
              </p>
            </div>
          </button>

          {/* Beta Channel */}
          <button
            type="button"
            onClick={() => setReleaseChannel("beta")}
            className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer ${
              releaseChannel === "beta"
                ? "bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-200 shadow-2xs"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="release-channel-select"
              checked={releaseChannel === "beta"}
              onChange={() => setReleaseChannel("beta")}
              className="mt-0.5 text-amber-600 focus:ring-amber-500 cursor-pointer flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold flex items-center gap-1 text-amber-900">
                <Flame className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="truncate">Beta</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight truncate">
                Mới nhất
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Preset Packs */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Gói Cài Đặt Nhanh (Preset Bundles)
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={handleAddVisualBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm ETF, EMF/CEM, Eating Animation, 3D Skin Layers, Visuality, Effective"
          >
            <Sparkles className="w-3 h-3" />
            <span>+ Hoạt Ảnh 3D</span>
          </button>
          <button
            type="button"
            onClick={handleAddTaCZGunBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm [TaCZ] Timeless and Classics Zero, LesRaisins Tactical, Valorant Knife, CS Knife, Arena Breakout Melee"
          >
            <Flame className="w-3 h-3 text-rose-600" />
            <span>+ Súng & Dao TaCZ</span>
          </button>
          <button
            type="button"
            onClick={handleAddKaleidoscopeBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm Kaleidoscope Cookery & Kaleidoscope: Immersive Eating"
          >
            <Sparkles className="w-3 h-3 text-orange-600" />
            <span>+ Nấu Ăn & Hoạt Ảnh</span>
          </button>
          <button
            type="button"
            onClick={handleAddPhysicsCreateBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm TerraBlender, Valkyrien Skies, Clockwork, Eureka! Ships!, Create: Interactive, Create Mod, Immersive Portals"
          >
            <Cog className="w-3 h-3 text-sky-600" />
            <span>+ Cơ Khí & Tàu Bay</span>
          </button>
          <button
            type="button"
            onClick={handleAddResourcePacksBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm Fresh Animations, Fresh Food, Fresh Buckets, Refined Tools, 3D Default, Bare Bones, Clean Glass"
          >
            <Layers className="w-3 h-3" />
            <span>+ Resource Packs</span>
          </button>
          <button
            type="button"
            onClick={handleAddShadersBundle}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm BSL Shaders, Complementary Reimagined, MakeUp UltraFast, Sildur's Vibrant"
          >
            <SunMedium className="w-3 h-3 text-amber-600" />
            <span>+ Shaders</span>
          </button>
          <button
            type="button"
            onClick={handleAddFullCombo}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all hover:cursor-pointer shadow-2xs"
            title="Thêm toàn bộ Mods Tối ưu + Hoạt Ảnh 3D + Cơ Khí + Resource Packs + Shaders"
          >
            <Zap className="w-3 h-3" />
            <span>+ Combo All</span>
          </button>
        </div>
      </div>

      {/* Shaders Section */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-950">
            <SunMedium className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wide">Mục Shaders Đồ Họa</span>
          </div>
          <span className="text-[10px] text-amber-800 font-medium bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
            Tự động lưu vào shaderpacks/
          </span>
        </div>
        <p className="text-[11px] text-amber-900 leading-snug">
          Click để bật/tắt nhanh các gói Shaders đồ họa phổ biến nhất (hỗ trợ Iris / OptiFine):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          {DEFAULT_SHADERS.map((sh) => {
            const isAdded = mods.includes(sh.id);
            return (
              <button
                key={sh.id}
                type="button"
                onClick={() => isAdded ? onRemoveMod(sh.id) : onAddMod(sh.id)}
                className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all hover:cursor-pointer ${
                  isAdded
                    ? "bg-amber-100/90 border-amber-300 text-amber-950 font-bold shadow-2xs"
                    : "bg-white/80 border-amber-200/70 text-gray-700 hover:bg-white hover:border-amber-300"
                }`}
                title={sh.name}
              >
                <div className="flex items-center space-x-2 truncate mr-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isAdded ? "bg-amber-500" : "bg-gray-300"}`}></span>
                  <span className="truncate">{sh.name.split(" (")[0]}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 font-mono ${
                  isAdded ? "bg-amber-200 text-amber-900" : "bg-gray-100 text-gray-500"
                }`}>
                  {isAdded ? "Đã chọn" : "+ Thêm"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Missing Dependency Warning & 1-Click Auto-Fix */}
      {missingDeps.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">Cảnh Báo Thiếu Thư Viện (Dễ Gây Crash Game)</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFixAllDependencies}
              className="inline-flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs hover:cursor-pointer"
            >
              <Wrench className="w-3 h-3" />
              <span>Sửa & Cài Hết Tự Động</span>
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-rose-950">
            {missingDeps.map((dep, idx) => (
              <div key={idx} className="bg-white/90 border border-rose-200 rounded-lg p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <p className="font-semibold text-rose-900 leading-tight">
                    • Mod <code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-bold">{dep.targetMod}</code> yêu cầu:
                  </p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{dep.reason}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dep.missing.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => onAddMod(m.slug)}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold px-2 py-1 rounded border border-rose-300 transition-colors hover:cursor-pointer whitespace-nowrap flex items-center gap-1"
                      title={`Thêm ${m.name}`}
                    >
                      <span>+ Cài {m.name.split(" (")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mod Slugs Management */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">
            Danh Sách Mods, Packs & Shaders ({mods.length})
          </label>
          <button
            id="btn-reset-mods"
            onClick={onResetMods}
            title="Khôi phục danh sách mặc định"
            className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-emerald-600 transition-colors hover:cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>
        </div>

        {/* Search & Check Mod Presence */}
        <div className="mb-3 space-y-1.5">
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm mod xem đã có trong danh sách chưa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-gray-250 rounded-lg pl-8 pr-8 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 hover:cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Result Feedback */}
          {searchStatus && (
            <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
              searchStatus.isExactPresent || searchStatus.matchCount > 0
                ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                : "bg-amber-50/90 border-amber-300 text-amber-950"
            }`}>
              <div className="flex items-center space-x-2 truncate">
                {searchStatus.isExactPresent || searchStatus.matchCount > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <div className="truncate">
                  {searchStatus.isExactPresent ? (
                    <span className="font-semibold text-emerald-900">
                      ✓ ĐÃ CÓ TRONG DANH SÁCH: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">{searchStatus.resolvedSlug}</code>
                    </span>
                  ) : searchStatus.matchCount > 0 ? (
                    <span>
                      Tìm thấy <strong>{searchStatus.matchCount}</strong> mod khớp với từ khóa "{searchQuery}"
                    </span>
                  ) : (
                    <span>
                      ⚠️ CHƯA CÓ TRONG DANH SÁCH: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">{searchStatus.resolvedSlug || searchQuery}</code>
                    </span>
                  )}
                </div>
              </div>

              {!searchStatus.isExactPresent && (
                <button
                  type="button"
                  onClick={() => {
                    onAddMod(searchStatus.resolvedSlug || searchQuery);
                    setSearchQuery("");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shadow-2xs hover:cursor-pointer flex-shrink-0"
                >
                  + Thêm Ngay
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add custom mod or URL */}
        <form onSubmit={handleAdd} className="space-y-1.5 mb-3">
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-gray-400">
              <LinkIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              required
              placeholder="Dán link Modrinth / CurseForge hoặc nhập tên slug để thêm..."
              value={newModInput}
              onChange={(e) => setNewModInput(e.target.value)}
              className="w-full text-xs bg-white border border-gray-250 rounded-lg pl-8 pr-20 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
            />
            <button
              type="submit"
              id="btn-add-mod"
              className="absolute right-1.5 bg-gray-900 hover:bg-gray-800 text-white px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1 hover:cursor-pointer shadow-2xs"
              title="Thêm Mod, Resource Pack hoặc Shader vào danh sách"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            Hỗ trợ dán link đầy đủ (Modrinth/CurseForge) hoặc gõ slug ngắn (ví dụ: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">falldrop-backport</code>, <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-mono">shine-vfx</code>).
          </p>
        </form>

        {/* Quick add toggle pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickPills.map(p => {
            const isAdded = mods.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => isAdded ? onRemoveMod(p.slug) : onAddMod(p.slug)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors hover:cursor-pointer ${
                  isAdded
                    ? p.isShader
                      ? "bg-amber-50 border-amber-200 text-amber-800 font-semibold"
                      : p.isPack
                      ? "bg-purple-50 border-purple-200 text-purple-700 font-semibold"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
                title={isAdded ? `Click để bỏ ${p.slug}` : `Click để thêm ${p.slug}`}
              >
                {isAdded ? "✓ " : "+ "}
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Mod List */}
        <div className="border border-gray-150 rounded-lg max-h-[220px] overflow-y-auto divide-y divide-gray-100 bg-gray-50/50 scrollbar-thin">
          {filteredMods.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">
              {searchQuery ? `Không tìm thấy mod nào khớp với "${searchQuery}"` : "Chưa có mod, resource pack hoặc shader nào được thêm."}
            </div>
          ) : (
            filteredMods.map((mod) => {
              const isShader = DEFAULT_SHADERS.some(s => s.id === mod) || mod.includes("shader");
              const isResourcePack = !isShader && DEFAULT_RESOURCE_PACKS.some(rp => rp.id === mod);
              const isCurseForgeOnly = mod === "shine-vfx" || mod === "shine" || mod === "chunky-pregenerator" || mod === "chunky";
              return (
                <div key={mod} className="flex items-center justify-between px-3 py-2 text-xs bg-white hover:bg-gray-50">
                  <div className="flex items-center space-x-2 truncate mr-2">
                    {isShader ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                        SHADER
                      </span>
                    ) : isResourcePack ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-150 uppercase">
                        PACK
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase">
                        MOD
                      </span>
                    )}
                    <span className="font-mono text-gray-700 truncate">{mod}</span>
                    {isCurseForgeOnly && (
                      <span className="text-[9px] font-semibold bg-amber-100 text-amber-800 px-1 rounded border border-amber-200">
                        CurseForge API
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    id={`btn-remove-mod-${mod}`}
                    onClick={() => onRemoveMod(mod)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors hover:cursor-pointer flex-shrink-0"
                    title={`Xóa ${mod}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Primary Actions: Chế Độ Chọn Kiểm Tra Link Tải */}
      <div className="pt-3 border-t border-gray-200 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Phạm Vi Kiểm Tra & Tải Về</span>
            </label>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {getScopeDisplayName(downloadScope)}
            </span>
          </div>

          {/* Prominent Selector Buttons for Scopes */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Tất Cả */}
            <button
              type="button"
              id="scope-btn-all"
              onClick={() => setDownloadScope("all")}
              className={`p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer flex flex-col justify-between ${
                downloadScope === "all"
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs text-gray-900 font-bold"
                  : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-xs font-black">
                  <Layers className={`w-3.5 h-3.5 ${downloadScope === "all" ? "text-emerald-600" : "text-gray-500"}`} />
                  Tất Cả
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  downloadScope === "all" ? "bg-emerald-200 text-emerald-900" : "bg-gray-200 text-gray-700"
                }`}>
                  {scopeCounts.all}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">Toàn bộ danh sách (Mặc định)</span>
            </button>

            {/* 2. Chỉ Mod Giảm Lag */}
            <button
              type="button"
              id="scope-btn-performance"
              onClick={() => setDownloadScope("performance")}
              className={`p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer flex flex-col justify-between ${
                downloadScope === "performance"
                  ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs text-gray-900 font-bold"
                  : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-xs font-black">
                  <Zap className={`w-3.5 h-3.5 ${downloadScope === "performance" ? "text-amber-500 fill-amber-500" : "text-gray-500"}`} />
                  Chỉ Giảm Lag
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  downloadScope === "performance" ? "bg-amber-200 text-amber-900" : "bg-gray-200 text-gray-700"
                }`}>
                  {scopeCounts.performance}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">FPS, RAM, Chunky, C2ME</span>
            </button>

            {/* 3. Chỉ Hoạt Ảnh 3D & HUD */}
            <button
              type="button"
              id="scope-btn-visual"
              onClick={() => setDownloadScope("visual")}
              className={`p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer flex flex-col justify-between ${
                downloadScope === "visual"
                  ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs text-gray-900 font-bold"
                  : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-xs font-black">
                  <Sparkles className={`w-3.5 h-3.5 ${downloadScope === "visual" ? "text-blue-500" : "text-gray-500"}`} />
                  Hoạt Ảnh 3D & HUD
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  downloadScope === "visual" ? "bg-blue-200 text-blue-900" : "bg-gray-200 text-gray-700"
                }`}>
                  {scopeCounts.visual}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">Eating, 3D Skin, WTHIT</span>
            </button>

            {/* 4. Chỉ Súng & Dao TaCZ */}
            <button
              type="button"
              id="scope-btn-combat"
              onClick={() => setDownloadScope("combat")}
              className={`p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer flex flex-col justify-between ${
                downloadScope === "combat"
                  ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs text-gray-900 font-bold"
                  : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-xs font-black">
                  <Flame className={`w-3.5 h-3.5 ${downloadScope === "combat" ? "text-rose-500" : "text-gray-500"}`} />
                  Súng & Dao TaCZ
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  downloadScope === "combat" ? "bg-rose-200 text-rose-900" : "bg-gray-200 text-gray-700"
                }`}>
                  {scopeCounts.combat}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">TaCZ Guns, Dao CS/Val</span>
            </button>
          </div>

          {/* 5. Full width: Chỉ Gói 3D & Shaders */}
          <button
            type="button"
            id="scope-btn-packs-shaders"
            onClick={() => setDownloadScope("packs_shaders")}
            className={`w-full mt-2 p-2.5 rounded-xl border text-left transition-all hover:cursor-pointer flex items-center justify-between ${
              downloadScope === "packs_shaders"
                ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-xs text-gray-900 font-bold"
                : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <SunMedium className={`w-4 h-4 ${downloadScope === "packs_shaders" ? "text-purple-600" : "text-gray-500"}`} />
              <div>
                <span className="text-xs font-black">Chỉ Gói Tài Nguyên 3D & Shaders</span>
                <p className="text-[10px] text-gray-500">Fresh Animations, Bare Bones, Round Trees, BSL Shaders...</p>
              </div>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              downloadScope === "packs_shaders" ? "bg-purple-200 text-purple-900" : "bg-gray-200 text-gray-700"
            }`}>
              {scopeCounts.packs_shaders}
            </span>
          </button>
        </div>

        {/* ZIP Checkbox Option */}
        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              id="cfg-download-zip"
              checked={downloadAsZip}
              onChange={(e) => setDownloadAsZip(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-emerald-600" />
              Nén file ZIP (.zip) phân loại thư mục
            </span>
          </label>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Tự động chia mods/
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Action 1: Chạy Kiểm Tra */}
          <button
            type="button"
            id="btn-run-check"
            onClick={() => onRunCheck(downloadScope)}
            disabled={isChecking || currentScopeCount === 0}
            className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-2 transition-all hover:cursor-pointer interactive-button ${
              isChecking || currentScopeCount === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20"
            }`}
          >
            <Play className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            <span className="truncate">
              {isChecking
                ? "Đang truy vấn API..."
                : `🔍 Kiểm Tra Link: ${getScopeDisplayName(downloadScope)} (${currentScopeCount})`}
            </span>
          </button>

          {/* Action 2: Tải Xuống Ngay */}
          <button
            type="button"
            id="btn-quick-download-scope"
            onClick={() => onDownloadScope(downloadAsZip, downloadScope)}
            disabled={isChecking || isDownloading || downloadableModsCount === 0}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all hover:cursor-pointer interactive-button ${
              isChecking || isDownloading || downloadableModsCount === 0
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white shadow-gray-900/20 ring-1 ring-emerald-500/30"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">
              {isDownloading
                ? "Đang tải xuống..."
                : downloadableModsCount > 0
                ? `📥 Tải Ngay: ${getScopeDisplayName(downloadScope)} (${downloadAsZip ? "File ZIP" : "Tệp Rời"})`
                : "Chưa kiểm tra link tải (nhấn nút trên)"}
            </span>
          </button>

          {folderConfig?.autoInstallEnabled && onOpenBrowseTab && (
            <button
              type="button"
              onClick={onOpenBrowseTab}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">Tự động tải vào thư mục đang BẬT</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-200/70 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <span>Cấu hình</span>
                <span>&rarr;</span>
              </span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Tự động lọc tương thích phiên bản Minecraft và Mod Loader từ Modrinth & CurseForge API.
        </p>
      </div>
    </div>
  );
}

