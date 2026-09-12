import React from "react";
import { ScreeningHistoryItem } from "../types";
import { History, Trash2, Eye, Download, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface HistoryPageProps {
  history: ScreeningHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: ScreeningHistoryItem) => void;
  onStartNewScan: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onClearHistory,
  onSelectHistoryItem,
  onStartNewScan
}) => {
  return (
    <div id="screening-history-container" className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Screening History</h2>
          <p className="text-sm text-slate-400">
            Persistent audit ledger of previous retinal deep learning scans and diagnostic assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 text-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onStartNewScan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
          >
            <span>New Retinal Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Previous Scans Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run an automated retinal scan through the CNN pipeline and save the report to view past clinical evaluations here.
            </p>
          </div>
          <button
            onClick={onStartNewScan}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
          >
            Launch First Retinal Scan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => {
            const isNormal = item.primaryDiagnosis.toLowerCase().includes("normal");
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
                  <span className="font-mono">{item.timestamp}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {item.sourceName}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {isNormal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <h4 className="font-bold text-white text-sm truncate">
                      {item.primaryDiagnosis}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">CNN Confidence:</span>
                    <span className="font-mono font-bold text-sky-400">
                      {item.confidence.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span className={`font-semibold ${isNormal ? "text-emerald-400" : "text-amber-400"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectHistoryItem(item)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 hover:border-sky-500 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Diagnostic Breakdown</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
