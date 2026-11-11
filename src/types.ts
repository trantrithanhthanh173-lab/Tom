/**
 * Types for the Fabric Mod Downloader application.
 */

export interface ModConfig {
  id: string; // ID or Slug
  name: string;
  category?: "core" | "visual" | "resourcepack" | "shader";
}

export interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_url: string | null;
  client_side?: string;
  server_side?: string;
  downloads?: number;
  project_type?: "mod" | "resourcepack" | "shader" | "modpack";
}

export interface ModrinthVersionFile {
  url: string;
  filename: string;
  primary: boolean;
  size: number;
  hashes: {
    sha1: string;
    sha512: string;
  };
}

export interface ModrinthVersion {
  id: string;
  project_id: string;
  name: string;
  version_number: string;
  date_published: string;
  downloads: number;
  version_type: "release" | "beta" | "alpha";
  files: ModrinthVersionFile[];
  game_versions: string[];
  loaders: string[];
  changelog?: string;
}

export type ReleaseChannel = "release" | "beta";

export type DownloadScope = "all" | "performance" | "visual" | "combat" | "packs_shaders";

export interface ModStatus {
  slug: string;
  project?: ModrinthProject;
  latestCompatibleVersion?: ModrinthVersion;
  latestFile?: ModrinthVersionFile;
  status: "idle" | "checking" | "success" | "warning" | "error";
  message: string;
  sourceProvider?: "modrinth" | "curseforge";
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: "success" | "update" | "error" | "info";
  mod: string;
  text: string;
}

export interface LoadingProgress {
  isActive: boolean;
  type: "check" | "download_zip" | "download_batch" | "direct_folder_sync";
  title: string;
  currentItemName: string;
  currentFolder?: "mods" | "resourcepacks" | "shaderpacks" | "root";
  currentIndex: number;
  totalItems: number;
  percent: number;
  detail?: string;
}

export interface FolderPathsConfig {
  autoInstallEnabled: boolean;
  baseMinecraftPath: string;
  modsPath: string;
  resourcePacksPath: string;
  shadersPath: string;
}

export interface FolderSyncFileResult {
  filename: string;
  size: number;
  folder: "mods" | "resourcepacks" | "shaderpacks";
  status: "success" | "skipped" | "error";
  error?: string;
}
