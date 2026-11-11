import { useState } from "react";
import { ModStatus } from "../types";
import { formatBytes } from "../utils";
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FileDown, 
  AlertCircle,
  HelpCircle,
  Clock,
  RefreshCw
} from "lucide-react";

interface ModUpdatesPanelProps {
  modStatuses: ModStatus[];
  isChecking: boolean;
  onRunCheck: () => void;
  onBackToDashboard: () => void;
}

// Simple and safe markdown parser helper for changelogs
function parseMarkdownToHtml(markdown: string | undefined): string {
  if (!markdown) return "<p class='text-gray-400 italic'>Không có chi tiết cập nhật cho phiên bản này.</p>";

  // Prevent XSS while allowing basic markdown formatting
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-200 p-3 rounded-lg my-3 font-mono text-xs overflow-x-auto border border-gray-800">$1</pre>');

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-150 px-1.5 py-0.5 rounded font-mono text-xs text-rose-600 font-semibold">$1</code>');

  // Headers (### Header)
  html = html.replace(/^\s*###\s+(.+)$/gm, '<h5 class="text-xs font-bold text-gray-900 mt-4 mb-2 uppercase tracking-wider">$1</h5>');
  html = html.replace(/^\s*##\s+(.+)$/gm, '<h4 class="text-sm font-extrabold text-gray-900 mt-5 mb-2 border-b border-gray-100 pb-1">$1</h4>');
  html = html.replace(/^\s*#\s+(.+)$/gm, '<h3 class="text-base font-extrabold text-gray-950 mt-6 mb-3 border-b border-gray-200 pb-1.5">$1</h3>');

  // Bold (**bold**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-950">$1</strong>');
  
  // Italic (*italic*)
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>');

  // Bullet points (- point)
  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li class="list-disc ml-5 mb-1 text-gray-600 text-xs">$1</li>');

  // Ordered list items (1. point)
  html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="list-decimal ml-5 mb-1 text-gray-600 text-xs">$2</li>');

  // Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:underline inline-flex items-center gap-0.5">$1 <span class="text-[9px]">↗</span></a>');

  // Split into paragraphs for double newlines
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map((p) => {
      // If it already is a heading or list, don't wrap in p tag
      if (p.trim().startsWith("<h") || p.trim().startsWith("<li") || p.trim().startsWith("<pre")) {
        return p;
      }
      return `<p class="text-xs text-gray-600 leading-relaxed mb-2.5">${p}</p>`;
    })
    .join("\n");

  return html;
}

// Human readable time ago
function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(seconds)) return dateString.split("T")[0];

    const intervals = {
      năm: 31536000,
      tháng: 2592000,
      tuần: 604800,
      ngày: 86400,
      giờ: 3600,
      phút: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `${count} ${unit} trước`;
      }
    }
    return "Vừa xong";
  } catch {
    return dateString;
  }
}

export default function ModUpdatesPanel({ 
  modStatuses, 
  isChecking, 
  onRunCheck, 
  onBackToDashboard 
}: ModUpdatesPanelProps) {
  const [expandedMods, setExpandedMods] = useState<Record<string, boolean>>({});

  const toggleExpand = (slug: string) => {
    setExpandedMods(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const completedChecks = modStatuses.filter(m => m.status !== "idle" && m.status !== "checking");
  const hasUpdatesInfo = completedChecks.length > 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Nhật Ký Bản Cập Nhật Chi Tiết
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Xem nhanh nhật ký cập nhật (changelog), thông số tệp tin và hướng dẫn chi tiết của các bản phân phối mới nhất lấy trực tiếp từ Modrinth.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!hasUpdatesInfo ? (
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:cursor-pointer"
            >
              Về Dashboard Kiểm Tra
            </button>
          ) : (
            <button
              onClick={onRunCheck}
              disabled={isChecking}
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-all hover:cursor-pointer flex items-center gap-1.5 ${
                isChecking
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
              Kiểm Tra Lại
            </button>
          )}
        </div>
      </div>

      {/* No updates checked yet empty state */}
      {!hasUpdatesInfo && (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center max-w-xl mx-auto shadow-2xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">Chưa có dữ liệu cập nhật</h3>
          <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
            Bạn cần chạy tính năng <strong>"Kiểm tra cập nhật"</strong> tại Bảng điều khiển trước để tải dữ liệu phiên bản và changelog từ API Modrinth về đây.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold bg-white hover:bg-gray-50 transition-colors hover:cursor-pointer"
            >
              Quay lại Bảng Điều Khiển
            </button>
            <button
              onClick={() => {
                onBackToDashboard();
                // Give a small delay for tab state change then click check
                setTimeout(() => {
                  onRunCheck();
                }, 150);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:cursor-pointer"
            >
              Chạy Kiểm Tra Ngay
            </button>
          </div>
        </div>
      )}

      {/* Updates grid/list */}
      {hasUpdatesInfo && (
        <div className="space-y-4">
          {completedChecks.map((mod) => {
            const isExpanded = !!expandedMods[mod.slug];
            const hasVersion = !!mod.latestCompatibleVersion;
            const project = mod.project;
            const version = mod.latestCompatibleVersion;
            const file = mod.latestFile;
            
            return (
              <div 
                key={mod.slug} 
                className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-2xs hover:border-gray-300 transition-all"
                id={`update-mod-${mod.slug}`}
              >
                {/* Header section (Always visible) */}
                <div 
                  onClick={() => toggleExpand(mod.slug)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    {project?.icon_url ? (
                      <img 
                        src={project.icon_url} 
                        alt={project.title} 
                        className="w-11 h-11 rounded-lg border border-gray-150 flex-shrink-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-extrabold text-gray-900 text-sm truncate">{project?.title || mod.slug}</h3>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono font-medium">
                          {mod.slug}
                        </span>
                        
                        {hasVersion && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            version.version_type === "release" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : version.version_type === "beta"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}>
                            {version.version_type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1 max-w-[450px]">
                        {hasVersion 
                          ? `Phiên bản: ${version.version_number} • Tải lên: ${timeAgo(version.date_published)}`
                          : mod.message
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {hasVersion && file && (
                      <a
                        href={file.url}
                        onClick={(e) => e.stopPropagation()}
                        download
                        className="hidden sm:inline-flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors hover:cursor-pointer"
                        title={`Tải về: ${file.filename}`}
                      >
                        <Download className="w-3.5 h-3.5 text-gray-500" />
                        <span>Tải về ({formatBytes(file.size, 1)})</span>
                      </a>
                    )}
                    <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible details section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-gray-50/20">
                    {hasVersion && version ? (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                        {/* Meta information sidebar (4 columns) */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3.5 shadow-2xs">
                            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-600" />
                              Thông số kỹ thuật
                            </h4>
                            
                            <div className="space-y-2.5 text-xs">
                              <div className="flex justify-between py-1.5 border-b border-gray-100">
                                <span className="text-gray-500">Tên phiên bản</span>
                                <span className="font-semibold text-gray-900 truncate max-w-[150px] text-right" title={version.name}>
                                  {version.name}
                                </span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-gray-100">
                                <span className="text-gray-500">Mã phiên bản</span>
                                <span className="font-mono font-bold text-gray-800">{version.version_number}</span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-gray-100">
                                <span className="text-gray-500">Ngày đăng</span>
                                <span className="font-medium text-gray-800 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  {new Date(version.date_published).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-gray-100">
                                <span className="text-gray-500">Tải về trực tiếp</span>
                                <span className="font-medium text-gray-800">{version.downloads.toLocaleString("vi-VN")} lượt</span>
                              </div>
                            </div>

                            {/* Game & Loader Compatibilities */}
                            <div className="pt-2 space-y-2">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                  Minecraft hỗ trợ
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {version.game_versions.map(v => (
                                    <span key={v} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="pt-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                  Mod Loader
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {version.loaders.map(l => (
                                    <span key={l} className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 uppercase">
                                      {l}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action panel */}
                          {file && (
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl text-white shadow-2xs space-y-3">
                              <h5 className="font-extrabold text-xs flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                Đã sẵn sàng tải xuống
                              </h5>
                              <p className="text-[11px] text-emerald-100 leading-relaxed">
                                Tệp JAR tương thích hoàn hảo đã được chỉ định. Bạn có thể tải ngay tệp này hoặc tải đồng thời qua file ZIP lớn.
                              </p>
                              
                              <div className="bg-white/10 rounded-lg p-2.5 space-y-1 text-xs truncate">
                                <div className="font-mono text-[10px] truncate" title={file.filename}>
                                  {file.filename}
                                </div>
                                <div className="text-[10px] text-emerald-200">
                                  Kích thước: {formatBytes(file.size, 1)}
                                </div>
                              </div>

                              <a
                                href={file.url}
                                download
                                className="flex items-center justify-center space-x-1.5 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs w-full py-2.5 rounded-lg transition-colors hover:cursor-pointer shadow-sm"
                              >
                                <FileDown className="w-4 h-4" />
                                <span>Tải Xuống Tệp JAR</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Changelog section (8 columns) */}
                        <div className="lg:col-span-8 space-y-3">
                          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs h-full flex flex-col">
                            <h4 className="font-extrabold text-gray-900 text-sm mb-3.5 pb-2.5 border-b border-gray-100 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              Nhật ký thay đổi (Changelog)
                            </h4>
                            <div 
                              className="prose prose-sm max-w-none text-xs text-gray-600 overflow-y-auto max-h-[350px] pr-2 scrollbar-thin"
                              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(version.changelog) }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-xs font-semibold">{mod.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">Vui lòng kiểm tra lại sự tương thích hoặc xem các thông số khác.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
