import { Cpu, FolderGit2, Sparkles, Box, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30 py-4 mb-6 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20 ring-4 ring-emerald-50 transition-transform duration-300 hover:scale-105">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Minecraft Multi-Loader
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-purple-100/70 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200/60">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Modrinth & CurseForge v2
                </span>
              </div>
              <h1 id="app-title" className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                Minecraft Mod & Resource Downloader
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Tự động quét bản Release / Beta tối ưu, tải gói ZIP phân loại 3 thư mục hoặc tạo Script Python tự động.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-gray-400 font-mono">Modrinth & CurseForge</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-gray-700">API Live Sync</span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <a
              href="https://modrinth.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-2xs hover:shadow-xs hover:cursor-pointer"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Modrinth</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

