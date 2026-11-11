import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import JSZip from "jszip";
import {
  DEFAULT_MODS,
  DEFAULT_RESOURCE_PACKS,
  DEFAULT_SHADERS,
  MOD_DEPENDENCIES_RULES,
  generatePythonScript,
  formatBytes,
  resolveModSlug,
  selectBestModrinthVersion,
  selectBestCurseForgeFile,
  isPerformanceMod,
  isModInScope,
  filterModsByScope,
  getScopeDisplayName,
  DEFAULT_FOLDER_PATHS,
  generateAutoInstallBat,
  generateAutoInstallSh
} from "./utils";
import {
  ModStatus,
  LogMessage,
  ModrinthProject,
  ModrinthVersion,
  LoadingProgress,
  ReleaseChannel,
  DownloadScope,
  FolderPathsConfig,
  FolderSyncFileResult
} from "./types";
import Header from "./components/Header";
import ModConfigPanel from "./components/ModConfigPanel";
import ModTable from "./components/ModTable";
import LogTerminal from "./components/LogTerminal";
import PythonCodeBlock from "./components/PythonCodeBlock";
import ModUpdatesPanel from "./components/ModUpdatesPanel";
import LoadingProgressBar from "./components/LoadingProgressBar";
import BrowseFolderTab from "./components/BrowseFolderTab";
import {
  FolderOpen,
  FolderClosed,
  File,
  Info,
  Settings,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  SunMedium,
  HardDrive,
  Zap
} from "lucide-react";

// Mock downloaded manifest state to demonstrate updates/skips
const INITIAL_LOCAL_MANIFEST: Record<string, { version_number: string; filename: string }> = {
  "sodium": {
    "version_number": "0.6.0",
    "filename": "sodium-fabric-mc1.21.1-0.6.0.jar"
  },
  "lithium": {
    "version_number": "0.12.1",
    "filename": "lithium-fabric-mc1.21.1-0.12.1.jar"
  }
};

const STORAGE_KEY_MODS = "minecraft_mod_downloader_mods_v2";
const STORAGE_KEY_VERSION = "minecraft_mod_downloader_mc_version";
const STORAGE_KEY_LOADER = "minecraft_mod_downloader_loader";
const STORAGE_KEY_PROVIDER = "minecraft_mod_downloader_provider";
const STORAGE_KEY_RELEASE_CHANNEL = "minecraft_mod_downloader_release_channel";
const STORAGE_KEY_DOWNLOAD_SCOPE = "minecraft_mod_downloader_download_scope";
const STORAGE_KEY_FOLDER_PATHS = "minecraft_mod_downloader_folder_paths";

export default function App() {
  const [minecraftVersion, setMinecraftVersion] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_VERSION) || "1.21.1";
    } catch {
      return "1.21.1";
    }
  });

  const [loader, setLoader] = useState<"fabric" | "forge">(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOADER);
      return saved === "forge" ? "forge" : "fabric";
    } catch {
      return "fabric";
    }
  });

  const [releaseChannel, setReleaseChannel] = useState<ReleaseChannel>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RELEASE_CHANNEL);
      return saved === "beta" ? "beta" : "release";
    } catch {
      return "release";
    }
  });

  const [mods, setMods] = useState<string[]>(() => {
    const defaultList = [
      ...DEFAULT_MODS.map(m => resolveModSlug(m.id)),
      ...DEFAULT_RESOURCE_PACKS.map(rp => resolveModSlug(rp.id)),
      ...DEFAULT_SHADERS.map(sh => resolveModSlug(sh.id))
    ];

    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize and resolve all existing slugs (remove 'voxy' as requested by user)
          const normalizedParsed = parsed
            .map((item: any) => resolveModSlug(String(item)))
            .filter((slug: string) => slug !== "voxy");

          // Merge newly introduced items if they weren't in user's previous list
          const newlyAdded = [
            "fabric-language-kotlin",
            "cicada",
            "appleskin",
            "refined-tools",
            "fresh-food",
            "fresh-music-discs",
            "fresh-flowers-and-plants",
            "fresh-buckets",
            "countereds-accurate-hitboxes",
            "emotecraft",
            "first-person-model",
            "playeranimator",
            "custom-player-models",
            "epic-fight",
            "player-animation-library",
            "bare-bones",
            "motschens-better-leaves",
            "3d-vanilla-lite",
            "bsl-shaders",
            "complementary-reimagined",
            "makeup-ultra-fast",
            "sildurs-vibrant-shaders",
            "do-a-barrel-roll",
            "easy-install",
            "fresh-moves",
            "zoomify",
            "gamma-utils",
            "krypton",
            "badoptimizations",
            "packet-fixer",
            "better-f1",
            "betterf3",
            "dynamic-fps",
            "c2me-fabric",
            "flashback",
            "freecam",
            "entityculling",
            "immediatelyfast",
            "lithium",
            "ferrite-core",
            "nosium",
            "shine-vfx",
            "debugify",
            "enhanced-block-entities",
            "skin-shuffle",
            "embeddium",
            "falldropbackport",
            "just-3d-stuffs",
            "sodium-extra",
            "terrablender",
            "valkyrien-skies",
            "clockwork",
            "eureka",
            "create-interactive",
            "create",
            "immersive-portals",
            "kotlin-for-forge",
            "photonics",
            "round-trees",
            "better-3d-blocks",
            "tacz",
            "lesraisins-tactical-equipements",
            "tacz-lr-valorant-knife-pack",
            "tacz-cs-default-knife",
            "tacz-lr-arena-breakout-infinite-melee-pack",
            "kaleidoscope-cookery",
            "kaleidoscope-immersive-eating",
            "wthit",
            "geckolib",
            "better-combat",
            "chunky-pregenerator"
          ].map(resolveModSlug);

          const merged = [...normalizedParsed];
          for (const item of newlyAdded) {
            if (!merged.includes(item)) {
              merged.push(item);
            }
          }
          if (merged.includes("emotecraft") && !merged.includes("player-animation-library")) {
            merged.push("player-animation-library");
          }
          if (merged.includes("do-a-barrel-roll") && !merged.includes("cicada")) {
            merged.push("cicada");
          }
          if (merged.includes("zoomify") && !merged.includes("fabric-language-kotlin")) {
            merged.push("fabric-language-kotlin");
          }
          return Array.from(new Set(merged.filter(m => m !== "voxy")));
        }
      }
    } catch {}
    return Array.from(new Set(defaultList.filter(m => m !== "voxy")));
  });

  const [provider, setProvider] = useState<"both" | "modrinth" | "curseforge">(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROVIDER);
      return (saved === "curseforge" || saved === "modrinth" || saved === "both") ? (saved as any) : "both";
    } catch {
      return "both";
    }
  });

  const [downloadScope, setDownloadScope] = useState<DownloadScope>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOWNLOAD_SCOPE);
      if (saved && ["all", "performance", "visual", "combat", "packs_shaders"].includes(saved)) {
        return saved as DownloadScope;
      }
    } catch {}
    return "all";
  });

  const [modStatuses, setModStatuses] = useState<ModStatus[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    isActive: false,
    type: "check",
    title: "LOADING",
    currentItemName: "",
    currentIndex: 0,
    totalItems: 0,
    percent: 0
  });
  const [activeTab, setActiveTab] = useState<"dashboard" | "browse" | "script" | "updates">("dashboard");

  const [folderConfig, setFolderConfig] = useState<FolderPathsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOLDER_PATHS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FOLDER_PATHS, ...parsed };
      }
    } catch {}
    return DEFAULT_FOLDER_PATHS;
  });

  const [directoryHandles, setDirectoryHandles] = useState<{
    root?: any;
    mods?: any;
    resourcepacks?: any;
    shaderpacks?: any;
  }>({});

  const [lastSyncResults, setLastSyncResults] = useState<FolderSyncFileResult[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save changes to localStorage whenever configuration updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MODS, JSON.stringify(mods));
    } catch {}
  }, [mods]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VERSION, minecraftVersion);
    } catch {}
  }, [minecraftVersion]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOADER, loader);
    } catch {}
  }, [loader]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
    } catch {}
  }, [provider]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RELEASE_CHANNEL, releaseChannel);
    } catch {}
  }, [releaseChannel]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOWNLOAD_SCOPE, downloadScope);
    } catch {}
  }, [downloadScope]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOLDER_PATHS, JSON.stringify(folderConfig));
    } catch {}
  }, [folderConfig]);

  // Virtual folder simulation
  const [virtualFolderFiles, setVirtualFolderFiles] = useState<Array<{ name: string; size: number; modId: string; folder: "mods" | "resourcepacks" | "shaderpacks" | "root" }>>([
    { name: "manifest.json", size: 342, modId: "system", folder: "root" },
    { name: "HUONG_DAN_CAI_DAT.txt", size: 520, modId: "system", folder: "root" },
    { name: "sodium-fabric-mc1.21.1-0.6.0.jar", size: 412431, modId: "sodium", folder: "mods" },
    { name: "lithium-fabric-mc1.21.1-0.12.1.jar", size: 284311, modId: "lithium", folder: "mods" }
  ]);

  // Initial setup of mod table status representation
  useEffect(() => {
    const allPresets = [...DEFAULT_MODS, ...DEFAULT_RESOURCE_PACKS, ...DEFAULT_SHADERS];
    const initialStatuses = mods.map((slug) => {
      // Find default name or format slug
      const defaultMod = allPresets.find((m) => m.id === slug);
      const displayName = defaultMod ? defaultMod.name : slug;
      const isShader = defaultMod?.category === "shader" || slug.includes("shader");
      const isResourcePack = !isShader && defaultMod?.category === "resourcepack";

      return {
        slug,
        status: "idle" as const,
        message: "Chờ thực hiện kiểm tra",
        project: {
          id: slug,
          slug: slug,
          title: displayName,
          description: "Chưa nạp thông tin",
          icon_url: null,
          client_side: (isResourcePack || isShader) ? "required" : "unknown",
          server_side: (isResourcePack || isShader) ? "unsupported" : "unknown",
          project_type: isShader ? "shader" : isResourcePack ? "resourcepack" : "mod",
          downloads: 0
        }
      };
    });
    setModStatuses(initialStatuses);
  }, [mods]);

  // Handle adding a new mod slug with automatic dependency checking
  const handleAddMod = (slug: string) => {
    const resolved = resolveModSlug(slug);
    const toAdd = [resolved];

    // Auto-detect any missing core dependencies
    const matchingRules = MOD_DEPENDENCIES_RULES.filter(r => r.targetMod === resolved);
    matchingRules.forEach(rule => {
      rule.requiredMods.forEach(req => {
        if (!mods.includes(req.slug) && !toAdd.includes(req.slug)) {
          toAdd.push(req.slug);
          addLog("info", req.slug, `Tự động bổ sung thư viện bắt buộc '${req.name}' cho mod '${resolved}'.`);
        }
      });
    });

    setMods((prev) => {
      const next = [...prev];
      toAdd.forEach(item => {
        if (!next.includes(item)) {
          next.push(item);
        }
      });
      return next;
    });
  };

  // Handle removing a mod slug
  const handleRemoveMod = (slug: string) => {
    setMods((prev) => prev.filter((m) => m !== slug));
    setModStatuses((prev) => prev.filter((m) => m.slug !== slug));
    addLog("info", slug, `Đã xóa '${slug}' khỏi danh sách.`);
  };

  // Reset to default mod list
  const handleResetMods = () => {
    setMods([
      ...DEFAULT_MODS.map((m) => m.id),
      ...DEFAULT_RESOURCE_PACKS.map((rp) => rp.id)
    ]);
  };

  const addLog = useCallback((type: LogMessage["type"], mod: string, text: string) => {
    const timestamp = new Date().toTimeString().split(" ")[0];
    const newLog: LogMessage = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      type,
      mod,
      text
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  const runUpdateCheck = async (targetScope?: DownloadScope) => {
    setIsChecking(true);
    setLogs([]);
    const activeScope = targetScope || downloadScope;
    const loaderName = loader === "fabric" ? "Fabric" : "Forge";
    const providerLabel = provider === "modrinth" ? "Modrinth" : "CurseForge";

    // Ensure all critical dependencies are present in active list
    const resolvedMods: string[] = Array.from(new Set(mods.map(resolveModSlug)));
    if (resolvedMods.includes("do-a-barrel-roll") && !resolvedMods.includes("cicada")) {
      resolvedMods.push("cicada");
      addLog("info", "Tự động bổ sung", "Đã tự động thêm thư viện 'cicada' (Bắt buộc cho Do a Barrel Roll)");
    }
    if (resolvedMods.includes("zoomify") && !resolvedMods.includes("fabric-language-kotlin")) {
      resolvedMods.push("fabric-language-kotlin");
      addLog("info", "Tự động bổ sung", "Đã tự động thêm thư viện 'fabric-language-kotlin' (Bắt buộc cho Zoomify)");
    }
    if (resolvedMods.includes("emotecraft") && !resolvedMods.includes("player-animation-library")) {
      resolvedMods.push("player-animation-library");
      addLog("info", "Tự động bổ sung", "Đã tự động thêm thư viện 'player-animation-library' (Bắt buộc cho Emotecraft)");
    }
    if (resolvedMods.length !== mods.length) {
      setMods(resolvedMods);
    }

    const modsToCheck = activeScope === "all" ? resolvedMods : filterModsByScope(resolvedMods, activeScope);

    addLog("info", "Hệ thống", `Bắt đầu kiểm tra link tải [Phạm vi: ${getScopeDisplayName(activeScope)}] (${modsToCheck.length} mục) từ nguồn ${providerLabel} cho Minecraft ${minecraftVersion} (${loaderName})...`);

    setLoadingProgress({
      isActive: true,
      type: "check",
      title: "LOADING",
      currentItemName: "Đang kết nối cơ sở dữ liệu...",
      currentIndex: 0,
      totalItems: modsToCheck.length,
      percent: 0,
      detail: `Kiểm tra ${modsToCheck.length} mục (${getScopeDisplayName(activeScope)})`
    });

    // We'll update the virtual files dynamically
    // Keep a local copy of virtual files
    let currentVirtualFiles = [...virtualFolderFiles.filter(f => f.modId === "system" || !modsToCheck.includes(f.modId))];
    const localManifest = { ...INITIAL_LOCAL_MANIFEST };

    const updatedStatuses: ModStatus[] = [];

    const cfApiKey = (import.meta as any).env?.VITE_CURSEFORGE_API_KEY || "";
    if (provider === "curseforge" && !cfApiKey) {
      addLog("info", "Hệ thống", "Lưu ý: Không tìm thấy VITE_CURSEFORGE_API_KEY. Hệ thống tự động kích hoạt Chế độ Tương Thích: Tải tệp & dữ liệu thực tế từ API Modrinth để tránh giới hạn CORS/API Key.");
    }

    // Query API sequentially to simulate a real script and avoid hitting rate limits
    for (let i = 0; i < modsToCheck.length; i++) {
      const rawSlug = modsToCheck[i];
      const slug = resolveModSlug(rawSlug);
      const allPresets = [...DEFAULT_MODS, ...DEFAULT_RESOURCE_PACKS, ...DEFAULT_SHADERS];
      const defaultMod = allPresets.find((m) => m.id === slug || m.id === rawSlug);
      const displayName = defaultMod ? defaultMod.name : slug;
      const isShader = defaultMod?.category === "shader" || slug.includes("shader") || ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(slug);
      const isResourcePack = !isShader && defaultMod?.category === "resourcepack";
      const folder = isShader ? "shaderpacks" : isResourcePack ? "resourcepacks" : "mods";

      // Enforce Shine: VFX and Chunky Pregenerator to always run via CurseForge API, other mods follow global provider
      const isCurseForgeOnlyMod = 
        slug === "shine-vfx" || slug === "shine" || slug === "shine-visual-effects" ||
        slug === "chunky-pregenerator" || slug === "chunky" || slug === "chunkypregenerator";
      const currentModProvider = isCurseForgeOnlyMod ? "curseforge" : provider;

      setLoadingProgress({
        isActive: true,
        type: "check",
        title: "LOADING",
        currentItemName: displayName,
        currentFolder: folder,
        currentIndex: i + 1,
        totalItems: modsToCheck.length,
        percent: Math.round((i / modsToCheck.length) * 100),
        detail: `Kiểm tra MC ${minecraftVersion} (${currentModProvider.toUpperCase()})`
      });

      setModStatuses((prev) =>
        prev.map((item) => (item.slug === rawSlug || item.slug === slug ? { ...item, slug, status: "checking", message: `Đang tải dữ liệu (${currentModProvider.toUpperCase()})...` } : item))
      );

      try {
        let projectData: any;
        let latestVersion: any;
        let primaryFile: any;
        let resolvedProvider: "modrinth" | "curseforge" = "modrinth";

        // Query functions for Modrinth
        const fetchModrinth = async () => {
          const projRes = await fetch(`https://api.modrinth.com/v2/project/${slug}`);
          if (!projRes.ok) {
            throw new Error(`Modrinth (${projRes.status}): Không tìm thấy dự án`);
          }
          const pData = await projRes.json();
          const verRes = await fetch(`https://api.modrinth.com/v2/project/${slug}/version`);
          if (!verRes.ok) {
            throw new Error("Không thể lấy danh sách phiên bản từ Modrinth");
          }
          const versionsData: ModrinthVersion[] = await verRes.json();
          const isProjectResourcePack = pData.project_type === "resourcepack" || isResourcePack;
          // Strict version check for mods. (Resource packs can allow minor patch variations)
          let compatibleVersions = versionsData.filter((v) => {
            const loaders = v.loaders.map((l) => l.toLowerCase());
            const hasLoader = isProjectResourcePack || loaders.includes(loader) || loaders.includes("minecraft") || loaders.length === 0;
            const hasMc = v.game_versions.includes(minecraftVersion);
            return hasLoader && hasMc;
          });

          if (compatibleVersions.length === 0 && isProjectResourcePack) {
            const mcPrefix = minecraftVersion.split(".").slice(0, 2).join(".");
            compatibleVersions = versionsData.filter((v) => {
              const loaders = v.loaders.map((l) => l.toLowerCase());
              const hasLoader = loaders.includes(loader) || loaders.includes("minecraft") || loaders.length === 0;
              const hasMcPrefix = v.game_versions.some((gv) => gv.startsWith(mcPrefix));
              return hasLoader && hasMcPrefix;
            });
          }

          if (compatibleVersions.length === 0) {
            throw new Error(`Không có phiên bản nào tương thích với Minecraft ${minecraftVersion} (${loaderName})`);
          }

          const bestVersion = selectBestModrinthVersion(compatibleVersions, releaseChannel);
          if (!bestVersion) {
            throw new Error(`Không tìm thấy file Modrinth cho MC ${minecraftVersion}`);
          }
          const file = bestVersion.files.find((f) => f.primary) || bestVersion.files[0];
          if (!file) {
            throw new Error("Không có tệp đính kèm trong bản phát hành Modrinth");
          }

          return {
            projectData: {
              id: pData.id,
              slug: pData.slug,
              title: pData.title,
              description: pData.description,
              icon_url: pData.icon_url,
              project_type: pData.project_type || "mod"
            },
            latestVersion: bestVersion,
            primaryFile: file
          };
        };

        // Query functions for CurseForge
        const fetchCurseForge = async () => {
          const classId = isShader ? "6552" : isResourcePack ? "12" : "6";
          const headers: Record<string, string> = {};
          if (cfApiKey) {
            headers["x-custom-cf-key"] = cfApiKey;
          }

          const searchRes = await fetch(`/api/curseforge/search?slug=${encodeURIComponent(slug)}&classId=${classId}`, { headers });
          if (!searchRes.ok) {
            throw new Error(`CurseForge Search (${searchRes.status})`);
          }
          const searchData = await searchRes.json();
          const cfMod = searchData.data?.[0];
          if (!cfMod) {
            throw new Error(`Không tìm thấy mod '${slug}' trên CurseForge`);
          }

          const filesRes = await fetch(`/api/curseforge/files/${cfMod.id}`, { headers });
          if (!filesRes.ok) {
            throw new Error("Không thể lấy danh sách tệp từ CurseForge");
          }
          const filesData = await filesRes.json();

          const compatibleFiles = (filesData.data || []).filter((f: any) => {
            const gameVersions = (f.gameVersions || []).map((gv: string) => gv.toLowerCase());
            const matchesMc = gameVersions.includes(minecraftVersion.toLowerCase()) || 
                              (isResourcePack && gameVersions.some((gv: string) => gv.startsWith(minecraftVersion.split(".").slice(0, 2).join("."))));
            const matchesLoader = isResourcePack || isShader || 
                                  gameVersions.includes(loader.toLowerCase()) || 
                                  gameVersions.includes("fabric") || 
                                  gameVersions.includes("quilt");
            return matchesMc && matchesLoader;
          });

          if (compatibleFiles.length === 0) {
            throw new Error(`Không có bản phát hành nào trên CurseForge cho Minecraft ${minecraftVersion} (${loaderName})`);
          }

          const latestFileCF = selectBestCurseForgeFile(compatibleFiles, releaseChannel) || compatibleFiles[0];

          let dlUrl = latestFileCF.downloadUrl;
          if (!dlUrl) {
            const fileIdStr = String(latestFileCF.id);
            const part1 = fileIdStr.substring(0, 4);
            const part2 = fileIdStr.substring(4);
            dlUrl = `https://edge.forgecdn.net/files/${part1}/${part2}/${latestFileCF.fileName}`;
          }

          return {
            projectData: {
              id: String(cfMod.id),
              slug: cfMod.slug || slug,
              title: cfMod.name || slug,
              description: cfMod.summary || "",
              icon_url: cfMod.logo?.url || ""
            },
            latestVersion: {
              id: String(latestFileCF.id),
              version_number: latestFileCF.displayName || latestFileCF.fileName,
              name: latestFileCF.displayName || latestFileCF.fileName,
              date_published: latestFileCF.fileDate,
              version_type: latestFileCF.releaseType === 1 ? "release" : (latestFileCF.releaseType === 2 ? "beta" : "alpha"),
              changelog: `### Bản phát hành CurseForge\n\nTên tệp: \`${latestFileCF.fileName}\`\nID phiên bản: \`${latestFileCF.id}\`\n\n*Nguồn tải: CurseForge API*`,
              downloads: latestFileCF.downloadCount || 0,
              game_versions: latestFileCF.gameVersions || [minecraftVersion],
              loaders: [loader]
            },
            primaryFile: {
              filename: latestFileCF.fileName,
              size: latestFileCF.fileLength,
              url: dlUrl,
              primary: true
            }
          };
        };

        if (provider === "curseforge") {
          addLog("info", slug, `[CurseForge API] Đang quét dữ liệu: ${slug}...`);
          const res = await fetchCurseForge();
          projectData = res.projectData;
          latestVersion = res.latestVersion;
          primaryFile = res.primaryFile;
          resolvedProvider = "curseforge";
        } else if (provider === "modrinth") {
          addLog("info", slug, `[Modrinth API] Đang quét dữ liệu: ${slug}...`);
          try {
            const res = await fetchModrinth();
            projectData = res.projectData;
            latestVersion = res.latestVersion;
            primaryFile = res.primaryFile;
            resolvedProvider = "modrinth";
          } catch (mrErr: any) {
            if (isCurseForgeOnlyMod) {
              addLog("info", slug, `[${displayName}] Mod quét CurseForge -> Chuyển sang CurseForge Backend...`);
              const res = await fetchCurseForge();
              projectData = res.projectData;
              latestVersion = res.latestVersion;
              primaryFile = res.primaryFile;
              resolvedProvider = "curseforge";
            } else {
              throw mrErr;
            }
          }
        } else {
          // Provider === "both" (Scan Modrinth first, if not found or no files, scan CurseForge)
          let modrinthSuccess = false;

          if (!isCurseForgeOnlyMod) {
            try {
              addLog("info", slug, `[Both Mode] 1. Quét Modrinth: ${slug}...`);
              const res = await fetchModrinth();
              projectData = res.projectData;
              latestVersion = res.latestVersion;
              primaryFile = res.primaryFile;
              resolvedProvider = "modrinth";
              modrinthSuccess = true;
            } catch (mrErr: any) {
              // Modrinth doesn't have it or no compatible version
              console.log(`[Both Mode] Modrinth failed for ${slug}: ${mrErr.message}`);
            }
          }

          if (!modrinthSuccess) {
            addLog("info", slug, `[Both Mode] 2. Modrinth không có file -> Tiếp tục quét sang CurseForge API Backend...`);
            const res = await fetchCurseForge();
            projectData = res.projectData;
            latestVersion = res.latestVersion;
            primaryFile = res.primaryFile;
            resolvedProvider = "curseforge";
            addLog("success", slug, `[Both Mode] ✓ Đã tìm thấy tệp trên CurseForge!`);
          }
        }

        // Determine folder type based on project metadata or presets
        const resolvedIsShader = isShader || projectData?.project_type === "shader";
        const resolvedIsResourcePack = !resolvedIsShader && (isResourcePack || projectData?.project_type === "resourcepack");
        const targetFolder: "mods" | "resourcepacks" | "shaderpacks" = resolvedIsShader ? "shaderpacks" : resolvedIsResourcePack ? "resourcepacks" : "mods";

        const channelLabel = latestVersion.version_type === "release" 
          ? "[Bản Release]" 
          : (latestVersion.version_type === "beta" ? "[Bản Beta - Chưa có Release]" : "[Bản Alpha]");

        // Check against our local virtual manifest
        const oldInfo = localManifest[slug];
        const isAlreadyInstalled = oldInfo && oldInfo.version_number === latestVersion.version_number;

        if (isAlreadyInstalled) {
          addLog(
            "success",
            slug,
            `Đã ở bản mới nhất: ${latestVersion.version_number} ${channelLabel} ([${targetFolder}/] ${primaryFile.filename}) - Bỏ qua.`
          );

          // Ensure it's in our virtual folder files
          if (!currentVirtualFiles.some(f => f.name === oldInfo.filename)) {
            currentVirtualFiles.push({
              name: primaryFile.filename,
              size: primaryFile.size,
              modId: slug,
              folder: targetFolder
            });
          }

          updatedStatuses.push({
            slug,
            project: projectData,
            latestCompatibleVersion: latestVersion,
            latestFile: primaryFile,
            status: "success",
            sourceProvider: resolvedProvider,
            message: `Bản ${latestVersion.version_type} mới nhất (Bỏ qua)`
          });

          setModStatuses((prev) =>
            prev.map((item) =>
              item.slug === slug || item.slug === rawSlug
                ? {
                    ...item,
                    slug,
                    project: projectData,
                    latestCompatibleVersion: latestVersion,
                    latestFile: primaryFile,
                    status: "success",
                    sourceProvider: resolvedProvider,
                    message: `Bản ${latestVersion.version_type} mới nhất (Đã lưu)`
                  }
                : item
            )
          );
        } else {
          // Update or new download
          if (oldInfo) {
            addLog(
              "update",
              slug,
              `Phát hiện bản mới: ${oldInfo.version_number} -> ${latestVersion.version_number} ${channelLabel}. Đã xóa tệp cũ '${oldInfo.filename}'.`
            );
          } else {
            addLog(
              "success",
              slug,
              `Tìm thấy mục mới: ${latestVersion.version_number} ${channelLabel}. Bắt đầu tải vào [${targetFolder}/]...`
            );
          }

          addLog("info", slug, `-> Đang tải tệp: [${targetFolder}/] ${primaryFile.filename} (${formatBytes(primaryFile.size)})...`);

          // Update virtual file list (remove old, add new)
          if (oldInfo) {
            currentVirtualFiles = currentVirtualFiles.filter(f => f.name !== oldInfo.filename);
          }
          currentVirtualFiles.push({
            name: primaryFile.filename,
            size: primaryFile.size,
            modId: slug,
            folder: targetFolder
          });

          // Simulate download delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          addLog("success", slug, `-> Đã tải thành công phiên bản ${latestVersion.version_number} vào ${targetFolder}/!`);

          updatedStatuses.push({
            slug,
            project: projectData,
            latestCompatibleVersion: latestVersion,
            latestFile: primaryFile,
            status: "warning", // Highlight update state
            sourceProvider: resolvedProvider,
            message: oldInfo ? "Đã cập nhật bản mới" : "Đã tải mới thành công"
          });

          setModStatuses((prev) =>
            prev.map((item) =>
              item.slug === slug || item.slug === rawSlug
                ? {
                    ...item,
                    slug,
                    project: projectData,
                    latestCompatibleVersion: latestVersion,
                    latestFile: primaryFile,
                    status: oldInfo ? "warning" : "success",
                    sourceProvider: resolvedProvider,
                    message: oldInfo ? "Đã cập nhật" : "Đã tải mới"
                  }
                : item
            )
          );
        }
      } catch (err: any) {
        const errorMsg = err.message || "Lỗi ngoài ý muốn";
        addLog("error", slug, `Lỗi xử lý: ${errorMsg}`);

        setModStatuses((prev) =>
          prev.map((item) =>
            item.slug === slug || item.slug === rawSlug
              ? {
                  ...item,
                  slug,
                  status: "error",
                  message: errorMsg
                }
              : item
          )
        );
      }
    }

    // Save mock manifest file size update
    const mockManifestData = currentVirtualFiles
      .filter(f => f.modId !== "system")
      .map(f => `${f.modId} (${f.folder}): ${f.name}`);
    
    currentVirtualFiles = currentVirtualFiles.map(f => 
      f.name === "manifest.json" 
        ? { ...f, size: JSON.stringify(mockManifestData).length + 40 } 
        : f
    );

    setVirtualFolderFiles(currentVirtualFiles);
    addLog("info", "Hệ thống", "HOÀN THÀNH QUÁ TRÌNH KIỂM TRA VÀ TẢI MODS & RESOURCE PACKS.");
    
    setLoadingProgress({
      isActive: true,
      type: "check",
      title: "LOADING",
      currentItemName: "Đã hoàn tất kiểm tra danh sách mods!",
      currentIndex: mods.length,
      totalItems: mods.length,
      percent: 100,
      detail: "Hoàn tất"
    });

    setTimeout(() => {
      setLoadingProgress((prev) => ({ ...prev, isActive: false }));
    }, 1000);

    setIsChecking(false);
  };

  const downloadableModsCount = useMemo(() => {
    return modStatuses.filter((m) => (m.status === "success" || m.status === "warning") && !!m.latestFile?.url).length;
  }, [modStatuses]);

  const handleDownloadAll = useCallback(async (downloadAsZip: boolean, targetScope: DownloadScope | boolean = "all") => {
    const activeScope: DownloadScope = typeof targetScope === "string" 
      ? targetScope 
      : (targetScope === true ? "performance" : downloadScope);

    const scopeDisplayName = getScopeDisplayName(activeScope);

    // Items that have valid download file
    const allDownloadableItems = modStatuses
      .filter((m) => (m.status === "success" || m.status === "warning") && !!m.latestFile?.url);

    const downloadableItems = allDownloadableItems.filter(m => isModInScope(m.slug, activeScope));

    if (downloadableItems.length === 0) {
      addLog("error", "Hệ thống", `Không có tệp hợp lệ nào sẵn sàng để tải cho phạm vi: "${scopeDisplayName}". Vui lòng bấm "Kiểm Tra Link" trước.`);
      return;
    }

    const skippedCount = modStatuses.length - downloadableItems.length;
    if (skippedCount > 0) {
      addLog("info", "Hệ thống", `Mục tiêu tải [${scopeDisplayName}]: Đang chọn ${downloadableItems.length} tệp phù hợp. Bỏ qua ${skippedCount} mục ngoài phạm vi.`);
    }

    if (downloadAsZip) {
      setIsDownloading(true);
      setLoadingProgress({
        isActive: true,
        type: "download_zip",
        title: "LOADING",
        currentItemName: `Đang khởi tạo gói ZIP: ${scopeDisplayName}...`,
        currentIndex: 0,
        totalItems: downloadableItems.length,
        percent: 0,
        detail: "Tạo cấu trúc thư mục 'mods/', 'resourcepacks/', 'shaderpacks/'"
      });

      addLog("info", "Hệ thống", `Đang tạo file ZIP cho [${scopeDisplayName}] (${downloadableItems.length} tệp)...`);
      const zip = new JSZip();

      // Explicitly pre-create the core Minecraft folders in the ZIP root
      zip.folder("mods");
      if (activeScope === "all" || activeScope === "packs_shaders") {
        zip.folder("resourcepacks");
        zip.folder("shaderpacks");
      }

      // Create installation guide text file
      let guideContent = `=== HƯỚNG DẪN CÀI ĐẶT ${scopeDisplayName.toUpperCase()} MINECRAFT ===\nPhiên bản Minecraft: ${minecraftVersion} (${loader.toUpperCase()})\nPhạm vi: ${scopeDisplayName}\nSố lượng tệp: ${downloadableItems.length}\n\n`;
      if (activeScope === "performance") {
        guideContent += `CHẾ ĐỘ: TỐI ƯU HIỆU NĂNG, TĂNG FPS & GIẢM LAG\n- Chứa các mod: Sodium, Chunky Pregenerator, Lithium, FerriteCore, EntityCulling, Indium, ModernFix, C2ME, ImmediatelyFast...\n\nCÁCH CÀI ĐẶT:\n1. Copy toàn bộ các tệp .jar trong thư mục 'mods/' này.\n2. Dán vào thư mục mods của game:\n   • Windows: %appdata%\\.minecraft\\mods\n   • Mac: ~/Library/Application Support/minecraft/mods\n   • Linux: ~/.minecraft/mods\nChúc bạn chơi mượt mà với FPS tối đa!`;
      } else if (activeScope === "combat") {
        guideContent += `CHẾ ĐỘ: SÚNG VÀ VŨ KHÍ CẬN CHIẾN TACZ\n- Chứa: Timeless and Classics Zero Guns (TaCZ), LesRaisins Tactical Equipements, Valorant Knife Pack, CS Default Knife, Arena Breakout Melee Pack...\n\nCÁCH CÀI ĐẶT:\n1. Copy toàn bộ tệp trong thư mục 'mods/' vào .minecraft/mods.\n2. Khởi động game và trải nghiệm kho vũ khí đỉnh cao!`;
      } else if (activeScope === "visual") {
        guideContent += `CHẾ ĐỘ: HOẠT ẢNH 3D & GIAO DIỆN SỐNG ĐỘNG\n- Chứa: Eating Animation, 3D Skin Layers, WTHIT, Better Combat, GeckoLib...\n\nCÁCH CÀI ĐẶT:\nCopy các file .jar vào thư mục .minecraft/mods.`;
      } else if (activeScope === "packs_shaders") {
        guideContent += `CHẾ ĐỘ: RESOURCE PACKS 3D & SHADERS\n- Thư mục 'resourcepacks/': Fresh Animations, Bare Bones, Refined Tools, 3D Blocks...\n- Thư mục 'shaderpacks/': BSL Shaders, Complementary Reimagined, MakeUp Ultra Fast, Sildur's Vibrant...\n\nCÁCH CÀI ĐẶT:\nDán vào .minecraft/resourcepacks và .minecraft/shaderpacks tương ứng.`;
      } else {
        guideContent += `KHI BẠN GIẢI NÉN FILE ZIP NÀY SẼ CÓ 3 THƯ MỤC CHÍNH:\n\n1. THƯ MỤC 'mods':\n   - Chứa tất cả các tệp .jar (Fabric API, Sodium, Iris Shaders, TaCZ, v.v.).\n   - Dán vào %appdata%\\.minecraft\\mods\n\n2. THƯ MỤC 'resourcepacks':\n   - Chứa các tệp gói tài nguyên .zip (Fresh Animations, Bare Bones...)\n   - Dán vào .minecraft\\resourcepacks\n\n3. THƯ MỤC 'shaderpacks':\n   - Chứa các tệp đổ bóng shaders (BSL, Complementary...)\n   - Dán vào .minecraft\\shaderpacks\n\nChúc bạn trải nghiệm Minecraft tuyệt vời!`;
      }

      zip.file("HUONG_DAN_CAI_DAT.txt", guideContent);
      zip.file(
        "AutoInstall_Minecraft_Mods.bat",
        generateAutoInstallBat(
          folderConfig.modsPath,
          folderConfig.resourcePacksPath,
          folderConfig.shadersPath
        )
      );
      zip.file(
        "auto_install_minecraft.sh",
        generateAutoInstallSh(
          folderConfig.modsPath,
          folderConfig.resourcePacksPath,
          folderConfig.shadersPath
        )
      );
      
      try {
        let count = 0;
        for (let i = 0; i < downloadableItems.length; i++) {
          const item = downloadableItems[i];
          const file = item.latestFile!;
          const filename = file.filename || file.url.substring(file.url.lastIndexOf("/") + 1) || "file.jar";
          
          const isShader = item.project?.project_type === "shader" || 
            DEFAULT_SHADERS.some(sh => sh.id === item.slug) || 
            item.slug.includes("shader") ||
            ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(item.slug);

          const isResourcePack = !isShader && (
            item.project?.project_type === "resourcepack" || 
            DEFAULT_RESOURCE_PACKS.some(rp => rp.id === item.slug) || 
            (filename.toLowerCase().endsWith(".zip") && !isShader)
          );

          const targetSubfolder = isShader ? "shaderpacks" : isResourcePack ? "resourcepacks" : "mods";

          setLoadingProgress({
            isActive: true,
            type: "download_zip",
            title: "LOADING",
            currentItemName: filename,
            currentFolder: targetSubfolder,
            currentIndex: i + 1,
            totalItems: downloadableItems.length,
            percent: Math.round(((i + 1) / (downloadableItems.length + 1)) * 90),
            detail: `${formatBytes(file.size, 1)}`
          });

          addLog("info", "Tải về", `Đang nén: [${targetSubfolder}/] ${filename}...`);
          try {
            // Using the proxy endpoint first with browser fallback
            const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(filename)}`;
            let response = await fetch(proxyUrl);
            if (!response.ok) {
              // Direct browser fallback if proxy failed (e.g., Modrinth CDN supports direct CORS)
              try {
                const directRes = await fetch(file.url);
                if (directRes.ok) {
                  response = directRes;
                }
              } catch {}
            }
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            
            // Put into proper subfolder: mods/, resourcepacks/ or shaderpacks/
            zip.file(`${targetSubfolder}/${filename}`, blob);
            count++;
            addLog("success", "Nén ZIP", `Đã lưu vào [${targetSubfolder}/]: ${filename}`);
          } catch (err) {
            addLog("error", "Lỗi nén", `Không thể tải ${filename}: ${(err as Error).message}`);
          }
        }

        if (count === 0) {
          addLog("error", "Hệ thống", "Không thể nén tệp nào thành công.");
          setIsDownloading(false);
          setLoadingProgress(prev => ({ ...prev, isActive: false }));
          return;
        }

        setLoadingProgress({
          isActive: true,
          type: "download_zip",
          title: "LOADING",
          currentItemName: `Đang đóng gói và nén tệp ZIP (${scopeDisplayName})...`,
          currentIndex: downloadableItems.length,
          totalItems: downloadableItems.length,
          percent: 95,
          detail: "Nén dữ liệu..."
        });

        addLog("info", "Hệ thống", `Đang biên dịch tệp ZIP hoàn chỉnh cho [${scopeDisplayName}] (${downloadableItems.length} tệp)...`);
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFilename = 
          activeScope === "performance" ? `minecraft_giam_lag_${minecraftVersion}_${loader}.zip` :
          activeScope === "combat" ? `minecraft_sung_dao_tacz_${minecraftVersion}_${loader}.zip` :
          activeScope === "visual" ? `minecraft_hoat_anh_3d_${minecraftVersion}_${loader}.zip` :
          activeScope === "packs_shaders" ? `minecraft_resourcepacks_shaders_${minecraftVersion}.zip` :
          `minecraft_full_pack_${minecraftVersion}_${loader}.zip`;

        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);

        setLoadingProgress({
          isActive: true,
          type: "download_zip",
          title: "LOADING",
          currentItemName: `Đã hoàn tất tải: ${zipFilename}`,
          currentIndex: downloadableItems.length,
          totalItems: downloadableItems.length,
          percent: 100,
          detail: "Thành công!"
        });

        addLog("success", "Hệ thống", `ĐÃ TẢI XUỐNG FILE ZIP HOÀN TẤT: ${zipFilename}`);
        addLog("info", "Hệ thống", `-> Gói [${scopeDisplayName}] đã sẵn sàng để sử dụng!`);

        setTimeout(() => {
          setLoadingProgress(prev => ({ ...prev, isActive: false }));
          setIsDownloading(false);
        }, 1200);
      } catch (err) {
        addLog("error", "Hệ thống", `Đã xảy ra lỗi khi tạo tệp ZIP: ${(err as Error).message}`);
        setIsDownloading(false);
        setLoadingProgress(prev => ({ ...prev, isActive: false }));
      }
    } else {
      setIsDownloading(true);
      setLoadingProgress({
        isActive: true,
        type: "download_batch",
        title: "LOADING",
        currentItemName: `Bắt đầu gửi ${downloadableItems.length} yêu cầu tải xuống...`,
        currentIndex: 0,
        totalItems: downloadableItems.length,
        percent: 0,
        detail: `Tải lẻ: ${scopeDisplayName}`
      });

      addLog("info", "Hệ thống", `Bắt đầu tải xuống hàng loạt ${downloadableItems.length} tệp (${scopeDisplayName})...`);

      downloadableItems.forEach((item, index) => {
        const file = item.latestFile!;
        setTimeout(() => {
          const url = file.url;
          const isResourcePack = item.project?.project_type === "resourcepack" || 
            DEFAULT_RESOURCE_PACKS.some(rp => rp.id === item.slug) || 
            file.filename?.toLowerCase().endsWith(".zip");
          const defaultExt = isResourcePack ? "pack.zip" : "mod.jar";
          const filename = file.filename || url.substring(url.lastIndexOf("/") + 1) || defaultExt;
          
          setLoadingProgress({
            isActive: true,
            type: "download_batch",
            title: "LOADING",
            currentItemName: filename,
            currentFolder: isResourcePack ? "resourcepacks" : "mods",
            currentIndex: index + 1,
            totalItems: downloadableItems.length,
            percent: Math.round(((index + 1) / downloadableItems.length) * 100),
            detail: `${index + 1}/${downloadableItems.length}`
          });

          addLog("success", "Tải về", `Đã gửi yêu cầu tải xuống: [${isResourcePack ? "ResourcePack" : "Mod"}] ${filename}`);
          
          // Using server proxy to force downloading as file attachment and prevent browser iframe blocks
          const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
          const a = document.createElement("a");
          a.href = proxyUrl;
          a.target = "_blank";
          a.setAttribute("download", filename);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          if (index === downloadableItems.length - 1) {
            setTimeout(() => {
              setLoadingProgress(prev => ({ ...prev, isActive: false }));
              setIsDownloading(false);
            }, 1000);
          }
        }, index * 400);
      });
    }
  }, [modStatuses, addLog, minecraftVersion, loader, downloadScope, folderConfig]);

  const handleSelectDirectory = async (type: "root" | "mods" | "resourcepacks" | "shaderpacks") => {
    if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
      addLog("error", "Browse", "Trình duyệt của bạn không hỗ trợ File System Access API. Bạn hãy dán đường dẫn trực tiếp.");
      return;
    }

    try {
      const handle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
      if (!handle) return;

      setDirectoryHandles((prev) => ({ ...prev, [type]: handle }));

      setFolderConfig((prev) => {
        const updated = { ...prev };
        if (type === "root") {
          updated.baseMinecraftPath = handle.name;
          const sep = updated.baseMinecraftPath.includes("/") ? "/" : "\\";
          updated.modsPath = `${handle.name}${sep}mods`;
          updated.resourcePacksPath = `${handle.name}${sep}resourcepacks`;
          updated.shadersPath = `${handle.name}${sep}shaderpacks`;
        } else if (type === "mods") {
          updated.modsPath = handle.name;
        } else if (type === "resourcepacks") {
          updated.resourcePacksPath = handle.name;
        } else if (type === "shaderpacks") {
          updated.shadersPath = handle.name;
        }
        return updated;
      });

      addLog("success", "Browse", `Đã liên kết thành công thư mục: ${handle.name}`);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        addLog("error", "Browse", `Lỗi chọn thư mục: ${err.message}`);
      }
    }
  };

  const handleDirectSyncToFolder = async () => {
    const activeScope = downloadScope;
    const scopeDisplayName = getScopeDisplayName(activeScope);
    const allDownloadableItems = modStatuses.filter(
      (m) => (m.status === "success" || m.status === "warning") && !!m.latestFile?.url
    );
    const downloadableItems = allDownloadableItems.filter((m) => isModInScope(m.slug, activeScope));

    if (downloadableItems.length === 0) {
      addLog(
        "error",
        "Thư mục",
        `Không có tệp hợp lệ nào sẵn sàng để tải cho phạm vi: "${scopeDisplayName}". Vui lòng bấm "Kiểm Tra Link" trước.`
      );
      return;
    }

    const hasFsApi = typeof window !== "undefined" && "showDirectoryPicker" in window;
    let rootHandle = directoryHandles.root;
    let modsHandle = directoryHandles.mods;
    let rpsHandle = directoryHandles.resourcepacks;
    let shadersHandle = directoryHandles.shaderpacks;

    // If no directory handle is linked yet and browser supports it, prompt user
    if (!rootHandle && !modsHandle && hasFsApi) {
      addLog("info", "Thư mục", "Đang mở hộp thoại chọn thư mục lưu tệp trên máy tính (.minecraft hoặc mods)...");
      try {
        const selected = await (window as any).showDirectoryPicker({ mode: "readwrite" });
        if (selected) {
          if (selected.name.toLowerCase() === "mods") {
            modsHandle = selected;
            setDirectoryHandles((prev) => ({ ...prev, mods: selected }));
          } else {
            rootHandle = selected;
            setDirectoryHandles((prev) => ({ ...prev, root: selected }));
          }
          addLog("success", "Thư mục", `Đã liên kết với thư mục: ${selected.name}`);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          addLog("info", "Thư mục", "Đã hủy thao tác chọn thư mục.");
          return;
        }
      }
    }

    // Direct write via File System Access API
    if (rootHandle || modsHandle) {
      setIsSyncing(true);
      setLoadingProgress({
        isActive: true,
        type: "direct_folder_sync",
        title: "LOADING",
        currentItemName: `Đang kết nối và lưu vào thư mục máy tính...`,
        currentIndex: 0,
        totalItems: downloadableItems.length,
        percent: 0,
        detail: "Khởi tạo ghi đĩa..."
      });

      const results: FolderSyncFileResult[] = [];
      let currentVirtualFiles = [...virtualFolderFiles];

      try {
        let targetModsHandle = modsHandle;
        let targetRpsHandle = rpsHandle;
        let targetShadersHandle = shadersHandle;

        if (rootHandle) {
          try {
            targetModsHandle = await rootHandle.getDirectoryHandle("mods", { create: true });
          } catch {}
          try {
            targetRpsHandle = await rootHandle.getDirectoryHandle("resourcepacks", { create: true });
          } catch {}
          try {
            targetShadersHandle = await rootHandle.getDirectoryHandle("shaderpacks", { create: true });
          } catch {}
        }

        let successCount = 0;

        for (let i = 0; i < downloadableItems.length; i++) {
          const item = downloadableItems[i];
          const file = item.latestFile!;
          const filename = file.filename || file.url.substring(file.url.lastIndexOf("/") + 1) || "file.jar";

          const isShader =
            item.project?.project_type === "shader" ||
            DEFAULT_SHADERS.some((sh) => sh.id === item.slug) ||
            item.slug.includes("shader") ||
            ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(item.slug);

          const isResourcePack =
            !isShader &&
            (item.project?.project_type === "resourcepack" ||
              DEFAULT_RESOURCE_PACKS.some((rp) => rp.id === item.slug) ||
              (filename.toLowerCase().endsWith(".zip") && !isShader));

          const targetSubfolder: "mods" | "resourcepacks" | "shaderpacks" = isShader
            ? "shaderpacks"
            : isResourcePack
            ? "resourcepacks"
            : "mods";

          const destFolderHandle =
            targetSubfolder === "mods"
              ? targetModsHandle
              : targetSubfolder === "resourcepacks"
              ? targetRpsHandle
              : targetShadersHandle;

          setLoadingProgress({
            isActive: true,
            type: "direct_folder_sync",
            title: "LOADING",
            currentItemName: filename,
            currentFolder: targetSubfolder,
            currentIndex: i + 1,
            totalItems: downloadableItems.length,
            percent: Math.round(((i + 1) / downloadableItems.length) * 100),
            detail: `Ghi vào ${targetSubfolder}/ (${formatBytes(file.size, 1)})`
          });

          addLog("info", "Tự động tải", `[${i + 1}/${downloadableItems.length}] Đang tải & ghi: ${filename}...`);

          try {
            const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(filename)}`;
            let response = await fetch(proxyUrl);
            if (!response.ok) {
              try {
                const directRes = await fetch(file.url);
                if (directRes.ok) response = directRes;
              } catch {}
            }
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const blob = await response.blob();

            if (destFolderHandle) {
              const fileHandle = await destFolderHandle.getFileHandle(filename, { create: true });
              const writable = await fileHandle.createWritable();
              await writable.write(blob);
              await writable.close();

              results.push({
                filename,
                size: file.size,
                folder: targetSubfolder,
                status: "success"
              });
              successCount++;

              const existingIdx = currentVirtualFiles.findIndex((vf) => vf.name === filename);
              if (existingIdx >= 0) {
                currentVirtualFiles[existingIdx] = {
                  name: filename,
                  size: file.size,
                  modId: item.slug,
                  folder: targetSubfolder
                };
              } else {
                currentVirtualFiles.push({
                  name: filename,
                  size: file.size,
                  modId: item.slug,
                  folder: targetSubfolder
                });
              }

              addLog("success", "Đã lưu", `✓ Đã ghi thẳng vào thư mục máy tính: [${targetSubfolder}/] ${filename}`);
            } else {
              results.push({
                filename,
                size: file.size,
                folder: targetSubfolder,
                status: "error",
                error: "Không tìm thấy thư mục đích"
              });
            }
          } catch (fetchErr: any) {
            results.push({
              filename,
              size: file.size,
              folder: targetSubfolder,
              status: "error",
              error: fetchErr.message
            });
            addLog("error", "Lỗi lưu", `Không thể lưu ${filename}: ${fetchErr.message}`);
          }
        }

        setLastSyncResults(results);
        setVirtualFolderFiles(currentVirtualFiles);

        addLog("success", "Hoàn tất", `🎉 TỰ ĐỘNG GHI THÀNH CÔNG ${successCount}/${downloadableItems.length} TỆP VÀO THƯ MỤC TRÊN MÁY TÍNH!`);

        setLoadingProgress({
          isActive: true,
          type: "direct_folder_sync",
          title: "LOADING",
          currentItemName: `Hoàn tất lưu ${successCount} tệp vào máy!`,
          currentIndex: downloadableItems.length,
          totalItems: downloadableItems.length,
          percent: 100,
          detail: "Thành công!"
        });

        setTimeout(() => {
          setLoadingProgress((prev) => ({ ...prev, isActive: false }));
          setIsSyncing(false);
        }, 1500);
        return;
      } catch (syncErr: any) {
        addLog("error", "Lỗi đồng bộ", `Lỗi trong quá trình ghi tệp: ${syncErr.message}`);
        setIsSyncing(false);
        setLoadingProgress((prev) => ({ ...prev, isActive: false }));
      }
    }

    // Fallback: If no handle was granted, automatically download ZIP with the custom bat script based on the pasted paths!
    addLog("info", "Tự động tải", `Chưa cấp quyền thư mục trực tiếp -> Tự động nén gói ZIP kèm Script Auto-Install (.bat) cho đường dẫn: ${folderConfig.modsPath}`);
    await handleDownloadAll(true, activeScope);
  };

  // Generate python code dynamically based on state
  const pythonCode = generatePythonScript(minecraftVersion, loader, mods, provider, releaseChannel);

  return (
    <div className="min-h-screen bg-gray-50/70 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-colors hover:cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "dashboard"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-950"
            }`}
          >
            <span>Bảng Điều Khiển Tải Mods</span>
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-colors hover:cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "browse"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-950"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Thư Mục Cài Đặt (Browse / Link Path)</span>
            {folderConfig.autoInstallEnabled && (
              <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-emerald-600" />
                AUTO BẬT
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("script")}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-colors hover:cursor-pointer ${
              activeTab === "script"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-950"
            }`}
          >
            Kịch Bản Python (Requests)
          </button>
          <button
            onClick={() => setActiveTab("updates")}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-colors hover:cursor-pointer ${
              activeTab === "updates"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-950"
            }`}
          >
            Xem Bản Cập Nhật
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8"
            >
              {/* Left Config Panel */}
              <div className="xl:col-span-4 space-y-6">
                <ModConfigPanel
                  minecraftVersion={minecraftVersion}
                  setMinecraftVersion={setMinecraftVersion}
                  loader={loader}
                  setLoader={setLoader}
                  mods={mods}
                  provider={provider}
                  setProvider={setProvider}
                  releaseChannel={releaseChannel}
                  setReleaseChannel={setReleaseChannel}
                  onAddMod={handleAddMod}
                  onRemoveMod={handleRemoveMod}
                  onResetMods={handleResetMods}
                  onRunCheck={runUpdateCheck}
                  isChecking={isChecking}
                  downloadScope={downloadScope}
                  setDownloadScope={setDownloadScope}
                  onDownloadScope={handleDownloadAll}
                  downloadableModsCount={downloadableModsCount}
                  isDownloading={isDownloading}
                  folderConfig={folderConfig}
                  onOpenBrowseTab={() => setActiveTab("browse")}
                />

                {/* Virtual Folder Visualization */}
                <div className="bg-white rounded-xl border border-gray-150 shadow-xs p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-gray-900 text-sm">Cấu trúc File ZIP khi giải nén</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-100 uppercase">
                      3 Thư Mục Riêng
                    </span>
                  </div>

                  <div className="bg-gray-950 text-gray-300 font-mono text-xs rounded-lg p-3.5 space-y-3 border border-gray-850 max-h-[280px] overflow-y-auto">
                    {/* Mods folder section */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                        <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>📁 mods/</span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          ({virtualFolderFiles.filter(f => f.folder === "mods").length} tệp .jar)
                        </span>
                      </div>
                      <div className="pl-4 space-y-1 border-l border-emerald-900/40 ml-1.5">
                        {virtualFolderFiles.filter(f => f.folder === "mods").length === 0 ? (
                          <p className="text-gray-600 italic text-[11px]">Chưa có tệp mod nào</p>
                        ) : (
                          virtualFolderFiles.filter(f => f.folder === "mods").map((file) => (
                            <div key={file.name} className="flex items-center justify-between hover:bg-gray-900/60 p-0.5 rounded transition-colors">
                              <div className="flex items-center space-x-1.5 truncate">
                                <File className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span className="truncate text-gray-300 text-[11px]" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">
                                {formatBytes(file.size, 1)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Resourcepacks folder section */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-purple-400 font-bold mb-1">
                        <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>🎨 resourcepacks/</span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          ({virtualFolderFiles.filter(f => f.folder === "resourcepacks").length} tệp .zip)
                        </span>
                      </div>
                      <div className="pl-4 space-y-1 border-l border-purple-900/40 ml-1.5">
                        {virtualFolderFiles.filter(f => f.folder === "resourcepacks").length === 0 ? (
                          <p className="text-gray-600 italic text-[11px]">Chưa có resource pack nào</p>
                        ) : (
                          virtualFolderFiles.filter(f => f.folder === "resourcepacks").map((file) => (
                            <div key={file.name} className="flex items-center justify-between hover:bg-gray-900/60 p-0.5 rounded transition-colors">
                              <div className="flex items-center space-x-1.5 truncate">
                                <File className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                <span className="truncate text-gray-300 text-[11px]" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">
                                {formatBytes(file.size, 1)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Shaderpacks folder section */}
                    <div>
                      <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1">
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>☀️ shaderpacks/</span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          ({virtualFolderFiles.filter(f => f.folder === "shaderpacks").length} tệp .zip)
                        </span>
                      </div>
                      <div className="pl-4 space-y-1 border-l border-amber-900/40 ml-1.5">
                        {virtualFolderFiles.filter(f => f.folder === "shaderpacks").length === 0 ? (
                          <p className="text-gray-600 italic text-[11px]">Chưa có shader pack nào</p>
                        ) : (
                          virtualFolderFiles.filter(f => f.folder === "shaderpacks").map((file) => (
                            <div key={file.name} className="flex items-center justify-between hover:bg-gray-900/60 p-0.5 rounded transition-colors">
                              <div className="flex items-center space-x-1.5 truncate">
                                <File className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                <span className="truncate text-gray-300 text-[11px]" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">
                                {formatBytes(file.size, 1)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Root Files */}
                    <div className="pt-1 border-t border-gray-800/80">
                      {virtualFolderFiles.filter(f => f.folder === "root").map((file) => (
                        <div key={file.name} className="flex items-center justify-between hover:bg-gray-900/50 p-0.5 rounded">
                          <div className="flex items-center space-x-1.5 truncate">
                            <File className={`w-3 h-3 flex-shrink-0 ${file.name.endsWith(".txt") ? "text-cyan-400" : "text-amber-400"}`} />
                            <span className="truncate text-gray-400 text-[11px]" title={file.name}>
                              {file.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-600">
                            {formatBytes(file.size, 1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">
                    ✨ <strong>Tự động phân tách:</strong> Tải ZIP về giải nén ra sẽ có <strong>3 thư mục 'mods'</strong>, <strong>'resourcepacks'</strong> và <strong>'shaderpacks'</strong> kèm tệp hướng dẫn chi tiết sẵn sàng copy vào <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px] font-mono">.minecraft</code>.
                  </p>
                </div>
              </div>

              {/* Right Content Section */}
              <div className="xl:col-span-8 space-y-6">
                <ModTable
                  modStatuses={modStatuses}
                  isChecking={isChecking}
                  isDownloading={isDownloading}
                  provider={provider}
                  downloadScope={downloadScope}
                  setDownloadScope={setDownloadScope}
                  onDownloadAll={handleDownloadAll}
                  onRemoveMod={handleRemoveMod}
                  folderConfig={folderConfig}
                  onOpenBrowseTab={() => setActiveTab("browse")}
                  onDirectSyncToFolder={handleDirectSyncToFolder}
                  isSyncing={isSyncing}
                />
                <AnimatePresence>
                  {loadingProgress.isActive && (
                    <LoadingProgressBar progress={loadingProgress} />
                  )}
                </AnimatePresence>
                <LogTerminal
                  logs={logs}
                  onClearLogs={() => setLogs([])}
                  isProcessing={isChecking || isDownloading}
                />
              </div>
            </motion.div>
          )}
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <BrowseFolderTab
                folderConfig={folderConfig}
                onUpdateFolderConfig={setFolderConfig}
                downloadScope={downloadScope}
                setDownloadScope={setDownloadScope}
                targetDownloadMods={modStatuses.filter(
                  (m) =>
                    (m.status === "success" || m.status === "warning") &&
                    !!m.latestFile?.url &&
                    isModInScope(m.slug, downloadScope)
                )}
                onDirectSyncToFolder={handleDirectSyncToFolder}
                isSyncing={isSyncing}
                isChecking={isChecking}
                minecraftVersion={minecraftVersion}
                loader={loader}
                lastSyncResults={lastSyncResults}
                directoryHandles={directoryHandles}
                onSelectDirectory={handleSelectDirectory}
                onResetPaths={() => setFolderConfig(DEFAULT_FOLDER_PATHS)}
              />

              <AnimatePresence>
                {loadingProgress.isActive && (
                  <LoadingProgressBar progress={loadingProgress} />
                )}
              </AnimatePresence>

              <LogTerminal
                logs={logs}
                onClearLogs={() => setLogs([])}
                isProcessing={isChecking || isDownloading || isSyncing}
              />
            </motion.div>
          )}
          {activeTab === "script" && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-5 text-sm text-emerald-850 flex items-start space-x-3.5">
                <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-950 mb-1">Cách vận hành mã nguồn Python:</h4>
                  <ul className="list-decimal list-inside space-y-1.5 text-xs text-emerald-900">
                    <li>Đảm bảo máy tính đã cài đặt Python 3.</li>
                    <li>Cài đặt thư viện requests bằng dòng lệnh: <code className="bg-emerald-100 font-semibold px-1.5 py-0.5 rounded font-mono border border-emerald-200">pip install requests</code>.</li>
                    <li>Sao chép hoặc tải tệp <code className="bg-emerald-100 font-semibold px-1.5 py-0.5 rounded font-mono border border-emerald-200">update_mods.py</code> bên dưới về máy.</li>
                    <li>Chạy script bằng lệnh: <code className="bg-emerald-100 font-semibold px-1.5 py-0.5 rounded font-mono border border-emerald-200">python update_mods.py</code>.</li>
                    <li>Script sẽ tạo thư mục <code className="font-semibold">mods_downloaded</code>, quản lý trùng lặp tự động bằng tệp kê khai <code className="font-semibold">manifest.json</code> và dọn dẹp các tệp cũ tương tự như giao diện đồ họa.</li>
                  </ul>
                </div>
              </div>

              <PythonCodeBlock code={pythonCode} />
            </motion.div>
          )}
          {activeTab === "updates" && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ModUpdatesPanel
                modStatuses={modStatuses}
                isChecking={isChecking}
                onRunCheck={runUpdateCheck}
                onBackToDashboard={() => setActiveTab("dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
