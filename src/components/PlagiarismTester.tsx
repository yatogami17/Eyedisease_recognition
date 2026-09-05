import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Code, 
  Cpu, 
  Trash2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  Terminal,
  Activity,
  CheckCircle2,
  Info
} from "lucide-react";
import { PlagiarismPreset, PlagiarismResult } from "../types";
import { PLAGIARISM_PRESETS } from "../data";

interface PlagiarismTesterProps {
  plagPresetId: string;
  setPlagPresetId: (id: string) => void;
  codeA: string;
  setCodeA: (code: string) => void;
  codeB: string;
  setCodeB: (code: string) => void;
  isPlagChecking: boolean;
  plagResult: PlagiarismResult | null;
  plagError: string | null;
  handlePlagiarismCheck: () => Promise<void>;
}

export function PlagiarismTester({
  plagPresetId,
  setPlagPresetId,
  codeA,
  setCodeA,
  codeB,
  setCodeB,
  isPlagChecking,
  plagResult,
  plagError,
  handlePlagiarismCheck
}: PlagiarismTesterProps) {
  // Local scanning steps animation simulation
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlagChecking) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlagChecking]);

  const handleClear = () => {
    setCodeA("");
    setCodeB("");
    setPlagPresetId("");
  };

  // Helper colors for status
  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "Critical Copy":
        return {
          text: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          glow: "shadow-red-500/10"
        };
      case "Suspicious":
        return {
          text: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          glow: "shadow-orange-500/10"
        };
      case "Low Risk":
        return {
          text: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          glow: "shadow-amber-500/10"
        };
      default:
        return {
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          glow: "shadow-emerald-500/10"
        };
    }
  };

  const activeColors = plagResult ? getSeverityColors(plagResult.status) : getSeverityColors("Negligible");

  return (
    <div id="plagiarism-workspace" className="flex flex-col gap-6 animate-fade-in">
      
      {/* BRAND & HEADER SUMMARY CARD */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono uppercase font-bold tracking-widest">Python Subsystem Engine</span>
              {plagPresetId === "preset-1percent" && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-sans font-semibold animate-pulse">1% Test Case Loaded</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Code Plagiarism Similarity Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Analyze code files and submissions for structural overlap, variable renaming, and logic re-arrangements. Powered by line-level sequence matching algorithms in Python.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1 font-mono text-[11px] text-slate-500 border-l border-slate-900 pl-4 md:pl-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>PYTHON AGENT ACTIVE</span>
            </div>
            <div>VERIFICATION RATIO: 1.0% MIN</div>
          </div>
        </div>
      </div>

      {/* PRESETS CONTAINER */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-lg">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Select Diagnostic Plagiarism Case</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLAGIARISM_PRESETS.map((preset) => {
            const isSelected = preset.id === plagPresetId;
            const is1Percent = preset.id === "preset-1percent";
            return (
              <button
                key={preset.id}
                onClick={() => setPlagPresetId(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 h-28 relative ${
                  isSelected 
                    ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/5" 
                    : "bg-slate-900/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-slate-100 line-clamp-1">{preset.name}</span>
                    {is1Percent && (
                      <span className="text-[8px] uppercase bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-mono font-bold shrink-0">⭐ Focus</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">{preset.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-slate-900">
                  <span className="text-[9px] text-slate-500 font-mono">Expected Score</span>
                  <span className={`text-[10px] font-mono font-bold ${is1Percent ? "text-emerald-400" : isSelected ? "text-blue-400" : "text-slate-300"}`}>{preset.expectedScore}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON WORKSPACE EDITORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CODE EDITOR A */}
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-mono">A</span>
              <span className="text-xs font-bold text-slate-200">Reference Code Base (File A)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{codeA.split("\n").length} Lines</span>
          </div>
          
          <textarea
            id="code-editor-a"
            value={codeA}
            onChange={(e) => setCodeA(e.target.value)}
            className="w-full h-80 bg-slate-900/50 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 resize-none leading-relaxed"
            placeholder="# Paste your baseline or reference code here..."
          />
        </div>

        {/* CODE EDITOR B */}
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-mono">B</span>
              <span className="text-xs font-bold text-slate-200">Suspect Submission (File B)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{codeB.split("\n").length} Lines</span>
          </div>
          
          <textarea
            id="code-editor-b"
            value={codeB}
            onChange={(e) => setCodeB(e.target.value)}
            className="w-full h-80 bg-slate-900/50 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 resize-none leading-relaxed"
            placeholder="# Paste your suspect code to test here..."
          />
        </div>

      </div>

      {/* CORE CONTROLS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-900">
        <div className="text-[11px] text-slate-400 max-w-md text-center sm:text-left leading-relaxed">
          <span className="font-semibold text-slate-200">💡 Clinical Test Hint:</span> Load the <strong className="text-emerald-400">1% Plagiarism Match</strong> preset to see a real-time verification of negligible boilerplate overlaps that do not trigger alerts.
        </div>
        
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleClear}
            className="py-2.5 px-4 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Editors</span>
          </button>
          
          <button
            onClick={handlePlagiarismCheck}
            disabled={isPlagChecking || (!codeA.trim() && !codeB.trim())}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isPlagChecking ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Python Scanning...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Run Plagiarism Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR ANNOUNCEMENT */}
      {plagError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Execution Error:</span> {plagError}
          </div>
        </div>
      )}

      {/* LOADING ANIMATED TRANSITION CARDS */}
      {isPlagChecking && (
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-xl">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <Cpu className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Analyzing Codebase Overlaps</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Please wait while the secure Python 3 subprocess normalizes text, strips comments, and runs SequenceMatcher...
            </p>
          </div>
          
          <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-xl p-3 mt-2 font-mono text-[10px] text-left text-slate-400 flex flex-col gap-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Terminal className="w-3 h-3" />
              <span>PYTHON_ENGINE_NATIVE_STDOUT</span>
            </div>
            <div className="flex items-center gap-1.5 transition-all">
              <span className={scanStep >= 0 ? "text-emerald-400 font-bold" : "text-slate-600"}>✓</span>
              <span className={scanStep >= 0 ? "text-slate-200" : "text-slate-600"}>[Subsystem] Spawning plagiarism_checker.py process successfully.</span>
            </div>
            <div className="flex items-center gap-1.5 transition-all">
              <span className={scanStep >= 1 ? "text-emerald-400 font-bold" : "text-slate-600"}>{scanStep >= 1 ? "✓" : "○"}</span>
              <span className={scanStep >= 1 ? "text-slate-200" : "text-slate-600"}>[Tokeniser] Cleansing whitespace, stripping single-line comment headers.</span>
            </div>
            <div className="flex items-center gap-1.5 transition-all">
              <span className={scanStep >= 2 ? "text-emerald-400 font-bold" : "text-slate-600"}>{scanStep >= 2 ? "✓" : "○"}</span>
              <span className={scanStep >= 2 ? "text-slate-200" : "text-slate-600"}>[Matcher] Evaluating line-level SequenceMatcher blocks on non-empty tokens.</span>
            </div>
            <div className="flex items-center gap-1.5 transition-all">
              <span className={scanStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-600"}>{scanStep >= 3 ? "✓" : "○"}</span>
              <span className={scanStep >= 3 ? "text-slate-200" : "text-slate-600"}>[Engine] Compilation completed. Outputting diagnostic JSON report to Node.</span>
            </div>
          </div>
        </div>
      )}

      {/* CORE DIAGNOSTIC RESULTS REPORT */}
      {plagResult && !isPlagChecking && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          
          {/* DIAGNOSTIC GRAPHIC BENTO CARD (Spans 4) */}
          <div className="xl:col-span-4 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col gap-6 items-center justify-center text-center">
            
            {/* SIMILARITY CIRCULAR GAUGE */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              
              {/* Outer Radial Circle Backdrop */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  className="stroke-slate-900"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  className={`transition-all duration-1000 ${
                    plagResult.plagiarismPercentage < 5 
                      ? "stroke-emerald-500" 
                      : plagResult.plagiarismPercentage < 30 
                        ? "stroke-amber-500" 
                        : plagResult.plagiarismPercentage < 65 
                          ? "stroke-orange-500" 
                          : "stroke-red-500"
                  }`}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={465}
                  strokeDashoffset={465 - (465 * plagResult.plagiarismPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Central text read-out */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {plagResult.plagiarismPercentage}%
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Overlap Score</span>
              </div>
            </div>

            {/* Severity Diagnosis Card */}
            <div className={`w-full p-4 rounded-2xl border text-center ${activeColors.bg} ${activeColors.border} ${activeColors.glow} shadow-lg transition-all`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Severity Classification</span>
              <span className={`text-md font-bold block mt-1 ${activeColors.text}`}>{plagResult.status}</span>
              <p className="text-[11px] text-slate-400 leading-snug mt-1.5">{plagResult.summary}</p>
            </div>

          </div>

          {/* DIAGNOSTIC DETAILS CARD (Spans 8) */}
          <div className="xl:col-span-8 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest font-bold">Clinical Analysis Narrative</span>
              <h3 className="text-md font-bold text-white mt-1">Diagnostic Report Findings</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                {plagResult.details}
              </p>
            </div>

            {/* Telemetry metadata block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/30 border border-slate-900 p-4 rounded-2xl">
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Total Lines (A)</span>
                <span className="text-xs text-slate-200 font-bold font-mono">{plagResult.telemetry.totalLinesA} lines</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Total Lines (B)</span>
                <span className="text-xs text-slate-200 font-bold font-mono">{plagResult.telemetry.totalLinesB} lines</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Matched Chars</span>
                <span className="text-xs text-slate-200 font-bold font-mono">{plagResult.telemetry.matchedChars} bytes</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Engine Subsystem</span>
                <span className="text-[10px] text-slate-200 font-semibold font-mono truncate block">{plagResult.telemetry.engine}</span>
              </div>
            </div>

            {/* Recommendations checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Recommended Actions Ledger</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plagResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-2.5 bg-slate-900/45 p-3 rounded-xl border border-slate-900">
                    <div className="w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-slate-300 leading-snug">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* FULL INTERACTIVE SIDE-BY-SIDE OVERLAP INSPECTOR (Spans 12) */}
          <div className="xl:col-span-12 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest font-bold">Visual Segment Mapping</span>
              <h3 className="text-md font-bold text-white mt-1">Identified Code Similarities</h3>
              <p className="text-xs text-slate-400 mt-1">
                The visual ledger below maps precise code segments and line indexes where structural sequence correlations were detected inside the suspect submission.
              </p>
            </div>

            {plagResult.matchedSegments.length > 0 ? (
              <div className="space-y-4 mt-2">
                {plagResult.matchedSegments.map((segment, index) => (
                  <div key={index} className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden shadow-inner">
                    
                    {/* Segment header bar */}
                    <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-500/15 text-blue-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {index + 1}
                        </span>
                        <span className="font-bold text-slate-200">Segment Overlap Match ({segment.lineCount} {segment.lineCount === 1 ? "line" : "lines"})</span>
                      </div>
                      
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">File A Lines: <strong className="text-blue-400">{segment.codeAStartLine}-{segment.codeAEndLine}</strong></span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">File B Lines: <strong className="text-purple-400">{segment.codeBStartLine}-{segment.codeBEndLine}</strong></span>
                      </div>
                    </div>
                    
                    {/* Segment code body */}
                    <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 bg-slate-950/60 leading-relaxed max-h-40 text-left">
                      <code>{segment.matchedContent}</code>
                    </pre>

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-900/20 border border-slate-900 border-dashed rounded-2xl gap-3">
                <div className="p-3 bg-emerald-500/15 rounded-full text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Prinstine Submission Authenticity</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                    No matching sequences or duplicate syntax patterns were identified between these files. The submission is classified as fully original.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
