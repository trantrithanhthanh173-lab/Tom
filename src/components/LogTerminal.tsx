import { useEffect, useRef } from "react";
import { LogMessage } from "../types";
import { Terminal, Trash2, Download, CheckCircle2 } from "lucide-react";

interface LogTerminalProps {
  logs: LogMessage[];
  onClearLogs: () => void;
  isProcessing: boolean;
}

export default function LogTerminal({ logs, onClearLogs, isProcessing }: LogTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY inside the terminal container without pulling the browser window down
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Export logs to text file
  const handleExportLogs = () => {
    const text = logs.map((log) => `[${log.timestamp}] [${log.mod}] ${log.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mod_downloader_logs_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-850 shadow-lg overflow-hidden flex flex-col h-[320px]">
      {/* Terminal Bar */}
      <div className="bg-gray-950 px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="h-4 w-px bg-gray-800"></div>
          <div className="flex items-center space-x-1 text-gray-400 font-mono text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>mod_downloader_terminal.log</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {logs.length > 0 && (
            <>
              <button
                id="btn-export-logs"
                onClick={handleExportLogs}
                title="Tải tệp nhật ký"
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                id="btn-clear-logs"
                onClick={onClearLogs}
                title="Xóa nhật ký"
                className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-gray-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div ref={containerRef} className="p-4 flex-1 overflow-y-auto font-mono text-xs text-gray-300 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Terminal className="w-8 h-8 text-gray-600 animate-pulse" />
            <p>Chưa có thông tin ghi log nào.</p>
            <p className="text-[10px] text-gray-600">Ấn nút "Chạy kiểm tra trực tuyến" ở trên để bắt đầu.</p>
          </div>
        ) : (
          logs.map((log) => {
            let typeColor = "text-gray-400";
            let typeTag = "";

            if (log.type === "success") {
              typeColor = "text-emerald-400 font-semibold";
              typeTag = "[Thành công]";
            } else if (log.type === "update") {
              typeColor = "text-purple-400 font-semibold";
              typeTag = "[Đã cập nhật]";
            } else if (log.type === "error") {
              typeColor = "text-rose-400 font-semibold";
              typeTag = "[Lỗi]";
            } else {
              typeColor = "text-sky-400";
              typeTag = "[Hệ thống]";
            }

            return (
              <div key={log.id} className="leading-relaxed hover:bg-gray-850/50 px-1.5 py-0.5 rounded transition-colors">
                <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                <span className={`${typeColor} mr-2`}>{typeTag}</span>
                <span className="text-gray-400 mr-1">({log.mod})</span>
                <span className="text-gray-100">{log.text}</span>
              </div>
            );
          })
        )}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-emerald-400 px-1.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            <span className="animate-pulse">Đang truy vấn Modrinth API...</span>
          </div>
        )}
      </div>
    </div>
  );
}
