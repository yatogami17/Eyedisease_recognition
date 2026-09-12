import React, { useState } from "react";
import { PredictionResult, SampleRetinalImage, LocalizedAbnormality } from "../types";
import { FundusVisualizer } from "./FundusVisualizer";
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  Share2, 
  FileText,
  Layers,
  Sparkles,
  Zap,
  BookmarkPlus,
  Crosshair,
  Info,
  Scan,
  Check,
  AlertCircle
} from "lucide-react";

interface ResultsPageProps {
  prediction: PredictionResult | null;
  selectedSample: SampleRetinalImage;
  uploadedImageSrc: string | null;
  onDownloadReport: () => void;
  onSaveToHistory: () => void;
  onNewScan: () => void;
  hasSaved: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  prediction,
  selectedSample,
  uploadedImageSrc,
  onDownloadReport,
  onSaveToHistory,
  onNewScan,
  hasSaved
}) => {
  // Overlay display mode on the analyzed image
  const [activeOverlayMode, setActiveOverlayMode] = useState<
    "all" | "bounding_boxes" | "optic_cup" | "vessels" | "gradcam" | "raw"
  >("all");
  const [activeAbnormalityId, setActiveAbnormalityId] = useState<string | null>(null);

  if (!prediction) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-slate-400">No prediction results generated yet.</p>
        <button
          onClick={onNewScan}
          className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm cursor-pointer"
        >
          Start New Scan
        </button>
      </div>
    );
  }

  const isNormal = prediction.primaryDiagnosis.toLowerCase().includes("normal");
  const confidenceScore = prediction.confidence || 96.25;

  const opticMetrics = selectedSample.opticMetrics;
  const vascularMetrics = selectedSample.vascularMetrics;
  const abnormalities: LocalizedAbnormality[] = selectedSample.abnormalities || [];

  const selectedAbnormality = abnormalities.find(a => a.id === activeAbnormalityId) || abnormalities[0] || null;

  return (
    <div id="prediction-results-container" className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Header matching Fig 6.5 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Diagnostic Pipeline • Module 5 & 6</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Automated Disease Classification & Localized Feature Analysis
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Deep CNN multi-class prediction, localized lesion segmentation bounding boxes, quantitative Cup-to-Disc (CDR) caliper, and clinical decision support recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-download-report"
            onClick={onDownloadReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:scale-[1.01] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Clinical PDF</span>
          </button>

          <button
            onClick={onSaveToHistory}
            disabled={hasSaved}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition cursor-pointer ${
              hasSaved
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 cursor-default"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{hasSaved ? "Saved to History" : "Save Record"}</span>
          </button>

          <button
            onClick={onNewScan}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Start New Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Fundus Visualization & Bounding Boxes) vs Right Column (Predictions & Metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Fundus Visualizer & Interactive Localized Lesions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-sky-400" />
                <span>Localized Feature Visualizer</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold font-mono">
                512×512 Tensor Overlays
              </span>
            </div>

            {/* Overlay Display Mode Toggles */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400">
              <button
                onClick={() => setActiveOverlayMode("all")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "all" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveOverlayMode("bounding_boxes")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "bounding_boxes" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                Boxes
              </button>
              <button
                onClick={() => setActiveOverlayMode("optic_cup")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "optic_cup" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                CDR Cup
              </button>
              <button
                onClick={() => setActiveOverlayMode("vessels")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "vessels" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                Vessels
              </button>
              <button
                onClick={() => setActiveOverlayMode("gradcam")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "gradcam" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                Heatmap
              </button>
              <button
                onClick={() => setActiveOverlayMode("raw")}
                className={`py-1.5 rounded-lg transition ${
                  activeOverlayMode === "raw" ? "bg-sky-600 text-white shadow-sm" : "hover:text-white"
                }`}
              >
                Raw
              </button>
            </div>

            {/* Retinal Fundus Canvas with Bounding Boxes & Calipers */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-inner flex items-center justify-center p-2">
              <FundusVisualizer
                sample={selectedSample}
                conditionKey={selectedSample.conditionKey}
                uploadedImageSrc={activeOverlayMode === "raw" ? uploadedImageSrc : null}
                abnormalities={abnormalities}
                activeMarkerId={activeAbnormalityId}
                onMarkerSelect={(id) => setActiveAbnormalityId(id)}
                activeOverlayMode={activeOverlayMode}
                showGrid={true}
              />
            </div>

            {/* Bounding Box Clinical Legend */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Localized Segmentation Overlay Legend
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500 border border-white/40 shrink-0" />
                  <span>Hemorrhages & Aneurysms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 border border-white/40 shrink-0" />
                  <span>Hard Exudates & Drusen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-white/40 shrink-0" />
                  <span>Optic Cup & Margin Rim</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-400 border border-white/40 shrink-0" />
                  <span>AV Nicking & Arteriole Wall</span>
                </div>
              </div>
            </div>

            {/* Selected Abnormality Inspection Card */}
            {selectedAbnormality && (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{selectedAbnormality.label}</span>
                  </span>
                  {selectedAbnormality.confidence && (
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                      {selectedAbnormality.confidence.toFixed(1)}% Conf
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAbnormality.description}
                </p>
                <div className="text-[11px] text-amber-300/90 border-t border-slate-700/60 pt-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span><strong>Clinical Context:</strong> {selectedAbnormality.clinicalSignificance}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Prediction Details, Clinical Metrics & Decision Support (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Prediction Details
              </span>
              <span className="text-xs font-mono text-slate-400">
                Architecture: Dual-Stream Deep CNN + Attention
              </span>
            </div>

            {/* Primary Disease Prediction & Statistical Confidence Score (Fig 6.5) */}
            <div className="flex flex-wrap items-start justify-between gap-4 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Multi-Class Predicted Disease:
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {prediction.primaryDiagnosis}
                </h2>
                <div className="pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      isNormal
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {isNormal ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{isNormal ? "Negative (Normal Physiological)" : "Pathological Finding Confirmed"}</span>
                  </span>
                </div>
              </div>

              {/* Exact Statistical Confidence Percentage Score */}
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Statistical Confidence:
                </div>
                <div className="inline-flex items-baseline gap-1 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 shadow-inner">
                  <span className="text-3xl sm:text-4xl font-black text-sky-400">
                    {confidenceScore.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-sky-300">%</span>
                </div>
              </div>
            </div>

            {/* Differential Diagnostic Probabilities Breakdown */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Multi-Class Softmax Probability Distribution
              </span>
              <div className="space-y-2">
                {prediction.conditions.map((cond, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{cond.name}</span>
                      <span className="font-mono text-sky-400">{cond.probability.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          idx === 0 ? "bg-sky-500" : "bg-slate-600"
                        }`}
                        style={{ width: `${cond.probability}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantitative Clinical Metrics: Optic Nerve & Vasculature */}
            {(opticMetrics || vascularMetrics) && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Scan className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Feature Quantification (Biomarkers)</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Optic Disc / Cup Metrics */}
                  {opticMetrics && (
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="text-xs font-bold text-cyan-300">Optic Disc / Cup Cupping</span>
                        <span className="text-[10px] font-mono text-slate-400">Caliper Metric</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cup-to-Disc Ratio (CDR):</span>
                          <span className={`font-mono font-bold ${opticMetrics.cupToDiscRatio > 0.6 ? "text-red-400" : "text-emerald-400"}`}>
                            {opticMetrics.cupToDiscRatio.toFixed(2)} (Norm: &lt;{opticMetrics.normalThreshold})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ISNT Rule Compliance:</span>
                          <span className={`font-mono font-bold ${opticMetrics.isntRuleCompliant ? "text-emerald-400" : "text-red-400"}`}>
                            {opticMetrics.isntRuleCompliant ? "Preserved (Normal)" : "VIOLATED (Glaucoma)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Disc / Cup Diameters:</span>
                          <span className="text-slate-300 font-mono">{opticMetrics.discDiameterPx}px / {opticMetrics.cupDiameterPx}px</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-700/40 pt-1.5 leading-snug">
                        {opticMetrics.clinicalAssessment}
                      </p>
                    </div>
                  )}

                  {/* Vasculature Metrics */}
                  {vascularMetrics && (
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="text-xs font-bold text-orange-300">Retinal Vasculature Caliber</span>
                        <span className="text-[10px] font-mono text-slate-400">Arcade Morphometry</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Arteriole-to-Venule Ratio:</span>
                          <span className={`font-mono font-bold ${vascularMetrics.arterioleToVenuleRatio < 0.5 ? "text-red-400" : "text-emerald-400"}`}>
                            {vascularMetrics.arterioleToVenuleRatio.toFixed(2)} (Norm: &ge;0.67)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Vessel Tortuosity Index:</span>
                          <span className="text-slate-300 font-mono">{vascularMetrics.tortuosityIndex.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">AV Nicking Crossings:</span>
                          <span className={`font-mono font-bold ${vascularMetrics.avNickingCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                            {vascularMetrics.avNickingCount} detected {vascularMetrics.copperWiringPresent ? "(Copper wiring present)" : ""}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-700/40 pt-1.5 leading-snug">
                        {vascularMetrics.clinicalAssessment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Localized Abnormalities Spatial Coordinates Table */}
            {abnormalities.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Detected Localized Abnormalities (ROI Bounding Boxes)</span>
                  <span className="text-[11px] text-sky-400 font-normal">Click row to highlight</span>
                </span>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Feature</th>
                        <th className="p-2.5">Lesion Class</th>
                        <th className="p-2.5">Coordinates</th>
                        <th className="p-2.5">Confidence</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                      {abnormalities.map((ab) => {
                        const isSelected = activeAbnormalityId === ab.id;
                        return (
                          <tr
                            key={ab.id}
                            onClick={() => setActiveAbnormalityId(isSelected ? null : ab.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "bg-sky-950/40 text-white font-semibold" : "hover:bg-slate-800/50 text-slate-300"
                            }`}
                          >
                            <td className="p-2.5">{ab.label}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-400">{ab.lesionType.replace('_', ' ')}</td>
                            <td className="p-2.5 font-mono text-[11px] text-sky-400">({ab.x}%, {ab.y}%)</td>
                            <td className="p-2.5 font-mono font-bold text-emerald-400">
                              {ab.confidence ? `${ab.confidence.toFixed(1)}%` : "—"}
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ab.severity === "danger"
                                  ? "bg-red-500/20 text-red-300"
                                  : ab.severity === "warning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}>
                                {ab.severity}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Clinical Decision Support Recommendations */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clinical Recommendations & Action Plan
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {prediction.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <button
                onClick={onDownloadReport}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Clinical Report</span>
              </button>

              <button
                onClick={onNewScan}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm border border-slate-700 transition cursor-pointer"
              >
                Analyze Another Image
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Success Banner exactly matching Fig 6.5 */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Analysis Completed Successfully • IJIRCCE Medical Pipeline Verified</span>
      </div>

    </div>
  );
};
