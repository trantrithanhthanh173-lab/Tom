import { useState } from "react";
import { FileCode, Copy, Check, Download } from "lucide-react";

interface PythonCodeBlockProps {
  code: string;
}

export default function PythonCodeBlock({ code }: PythonCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Không thể sao chép code: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "update_mods.py";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Split code into lines for displaying line numbers
  const lines = code.split("\n");

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-[520px]">
      {/* Code Header */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs text-slate-300 font-semibold">update_mods.py</span>
          <span className="text-[10px] text-slate-500 bg-slate-850 px-1.5 py-0.5 rounded font-mono">
            Python 3 + requests
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-750 transition-all hover:cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </>
            )}
          </button>
          <button
            id="btn-download-code"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-white bg-emerald-950/40 hover:bg-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-900/50 transition-all hover:cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải về .py</span>
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 overflow-auto font-mono text-xs text-slate-300 p-4 leading-relaxed bg-slate-950/70 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex">
          {/* Line numbers column */}
          <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 min-w-[2.5rem]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Actual code column */}
          <pre className="pl-4 select-text overflow-x-auto text-slate-100 flex-1 whitespace-pre">
            <code>
              {lines.map((line, i) => {
                // Highlighting simple comment lines for aesthetics
                let lineClass = "text-slate-300";
                if (line.trim().startsWith("#")) {
                  lineClass = "text-slate-500 italic";
                } else if (line.trim().startsWith('"""') || line.trim().endsWith('"""')) {
                  lineClass = "text-amber-500/90";
                } else if (line.includes("requests.") || line.includes("import requests")) {
                  lineClass = "text-emerald-400";
                } else if (line.includes("MINECRAFT_VERSION") || line.includes("LOADER") || line.includes("DOWNLOAD_DIR") || line.includes("MODS")) {
                  lineClass = "text-purple-300";
                }

                return (
                  <div key={i} className={`${lineClass} hover:bg-slate-850/45 px-1 rounded-sm`}>
                    {line || " "}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
