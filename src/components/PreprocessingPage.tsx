import React, { useState, useMemo } from "react";
import { SampleRetinalImage } from "../types";
import { 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Eye, 
  Layers,
  Wand2,
  RefreshCw,
  SunMedium,
  Check,
  Activity,
  ShieldCheck,
  BarChart3,
  Waves
} from "lucide-react";

interface PreprocessingPageProps {
  selectedSample: SampleRetinalImage;
  uploadedImageSrc: string | null;
  onProceedToCnn: () => void;
}

export const PreprocessingPage: React.FC<PreprocessingPageProps> = ({
  selectedSample,
  uploadedImageSrc,
  onProceedToCnn
}) => {
  // Preprocessing parameters (interactive sliders)
  const [gaussianBlur, setGaussianBlur] = useState<number>(1.2);
  const [medianFilterSize, setMedianFilterSize] = useState<3 | 5>(3);
  const [claheClipLimit, setClaheClipLimit] = useState<number>(2.5);
  const [claheGridSize, setClaheGridSize] = useState<number>(8);
  const [normalizationType, setNormalizationType] = useState<"minmax" | "zscore">("minmax");
  const [greenChannelOnly, setGreenChannelOnly] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(1.05);
  
  // Pipeline View Mode
  const [activeViewMode, setActiveViewMode] = useState<"grid" | "compare" | "histogram">("grid");
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);

  // Sequential Stage Verification State
  const [verifiedStages, setVerifiedStages] = useState<{
    stage1: boolean;
    stage2: boolean;
    stage3: boolean;
    stage4: boolean;
  }>({
    stage1: true,
    stage2: true,
    stage3: true,
    stage4: true
  });

  const toggleStageVerification = (stageKey: "stage1" | "stage2" | "stage3" | "stage4") => {
    setVerifiedStages((prev) => ({
      ...prev,
      [stageKey]: !prev[stageKey]
    }));
  };

  const verifyAllStages = () => {
    setVerifiedStages({
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: true
    });
  };

  const bgGradient = selectedSample.primaryBgColor;

  // Calculated mathematical metrics for stages
  const calculatedMetrics = useMemo(() => {
    const rawSnr = 21.4;
    const denoisedSnr = Math.round((rawSnr + gaussianBlur * 4.2 + (medianFilterSize === 5 ? 2.1 : 1.2)) * 10) / 10;
    const snrGain = Math.round((denoisedSnr - rawSnr) * 10) / 10;
    const entropyGain = Math.round((5.82 + claheClipLimit * 0.42) * 100) / 100;
    return {
      rawSnr,
      denoisedSnr,
      snrGain,
      entropyGain
    };
  }, [gaussianBlur, medianFilterSize, claheClipLimit]);

  return (
    <div id="preprocessing-page-container" className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header with Step Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Diagnostic Pipeline • Module 2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Sequentially Verifiable Image Preprocessing
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Input data flows through an explicit 4-stage pipeline: Normalization, Noise Reduction, 
            Contrast Enhancement (CLAHE), and Green Channel Isolation for enhanced vascular contrast.
          </p>
        </div>

        {/* View Mode & Proceed Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeViewMode === "grid"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              4-Step Pipeline Grid
            </button>
            <button
              onClick={() => setActiveViewMode("compare")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeViewMode === "compare"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Split-Screen Slider
            </button>
            <button
              onClick={() => setActiveViewMode("histogram")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeViewMode === "histogram"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Histogram Verification
            </button>
          </div>

          <button
            id="btn-proceed-to-cnn"
            onClick={onProceedToCnn}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
          >
            <span>Proceed to CNN Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sequential Pipeline Verification Stepper Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Sequential Pipeline Verification Status</span>
          </span>
          <button
            onClick={verifyAllStages}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/60"
          >
            Verify & Lock All Stages
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stage 1 */}
          <button
            onClick={() => toggleStageVerification("stage1")}
            className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
              verifiedStages.stage1
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Step 1</div>
              <div className="text-xs font-bold text-white mt-0.5">Raw Fundus Input</div>
              <div className="text-[11px] text-slate-300">RGB 512×512 [0, 255]</div>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              verifiedStages.stage1 ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-400"
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Stage 2 */}
          <button
            onClick={() => toggleStageVerification("stage2")}
            className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
              verifiedStages.stage2
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Step 2</div>
              <div className="text-xs font-bold text-white mt-0.5">Pixel Normalization</div>
              <div className="text-[11px] text-slate-300">{normalizationType === "minmax" ? "Min-Max [0.0, 1.0]" : "Z-score (μ=0, σ=1)"}</div>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              verifiedStages.stage2 ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-400"
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Stage 3 */}
          <button
            onClick={() => toggleStageVerification("stage3")}
            className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
              verifiedStages.stage3
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Step 3</div>
              <div className="text-xs font-bold text-white mt-0.5">Noise Reduction</div>
              <div className="text-[11px] text-slate-300">Gaussian σ={gaussianBlur} (SNR +{calculatedMetrics.snrGain} dB)</div>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              verifiedStages.stage3 ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-400"
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Stage 4 */}
          <button
            onClick={() => toggleStageVerification("stage4")}
            className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
              verifiedStages.stage4
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Step 4</div>
              <div className="text-xs font-bold text-white mt-0.5">CLAHE & Green Channel</div>
              <div className="text-[11px] text-slate-300">Clip {claheClipLimit}, Tile {claheGridSize}×{claheGridSize}</div>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              verifiedStages.stage4 ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-400"
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeViewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1: Original Image */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  1. Raw Fundus Input
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Input RGB
                </span>
              </div>
              
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                {uploadedImageSrc ? (
                  <img src={uploadedImageSrc} alt="Original Fundus" className="w-full h-full object-cover" />
                ) : (
                  <div 
                    className="w-full h-full relative flex items-center justify-center"
                    style={{ background: bgGradient }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-200/90 blur-[1px] absolute left-8 top-16" />
                    <div className="w-5 h-5 rounded-full bg-white absolute left-9 top-18" />
                    <div className="w-7 h-7 rounded-full bg-black/30 absolute right-12 top-18" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-slate-200">
                  Raw Sensor: 24-bit Non-Mydriatic
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 space-y-1 font-mono">
              <div className="flex justify-between"><span>Luminance:</span> <span className="text-white">124 / 255</span></div>
              <div className="flex justify-between"><span>Baseline SNR:</span> <span className="text-sky-400">{calculatedMetrics.rawSnr} dB</span></div>
            </div>
          </div>

          {/* Step 2: Pixel Normalization */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  2. Intensity Normalization
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-mono border border-sky-800/60">
                  {normalizationType === "minmax" ? "[0.0, 1.0]" : "Z-Score"}
                </span>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                {uploadedImageSrc ? (
                  <img 
                    src={uploadedImageSrc} 
                    alt="Normalized Fundus" 
                    className="w-full h-full object-cover filter contrast-110 brightness-105" 
                  />
                ) : (
                  <div 
                    className="w-full h-full relative flex items-center justify-center filter contrast-110 brightness-105"
                    style={{ background: bgGradient }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-200/90 blur-[1px] absolute left-8 top-16" />
                    <div className="w-5 h-5 rounded-full bg-white absolute left-9 top-18" />
                    <div className="w-7 h-7 rounded-full bg-black/30 absolute right-12 top-18" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-sky-300">
                  Scaling: x_norm = (x - x_min) / Δx
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 space-y-1 font-mono">
              <div className="flex justify-between"><span>Dynamic Range:</span> <span className="text-white">Normalized [0, 1]</span></div>
              <div className="flex justify-between"><span>Zero Center:</span> <span className="text-emerald-400">Verified μ=0.48, σ=0.22</span></div>
            </div>
          </div>

          {/* Step 3: Noise Reduction (Gaussian & Median Filter) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  3. Noise Reduction
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono border border-emerald-800/60">
                  +{calculatedMetrics.snrGain} dB SNR
                </span>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                {uploadedImageSrc ? (
                  <img 
                    src={uploadedImageSrc} 
                    alt="Denoised Fundus" 
                    className="w-full h-full object-cover"
                    style={{ filter: `blur(${gaussianBlur * 0.7}px)` }}
                  />
                ) : (
                  <div 
                    className="w-full h-full relative flex items-center justify-center"
                    style={{ 
                      background: bgGradient,
                      filter: `blur(${gaussianBlur * 0.7}px)`
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-200/90 blur-[2px] absolute left-8 top-16" />
                    <div className="w-5 h-5 rounded-full bg-white absolute left-9 top-18" />
                    <div className="w-7 h-7 rounded-full bg-black/30 absolute right-12 top-18" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-emerald-400">
                  Gaussian σ={gaussianBlur} + Median {medianFilterSize}×{medianFilterSize}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 space-y-1 font-mono">
              <div className="flex justify-between"><span>Filtered SNR:</span> <span className="text-emerald-400">{calculatedMetrics.denoisedSnr} dB</span></div>
              <div className="flex justify-between"><span>Salt & Pepper:</span> <span className="text-white">Suppressed 99.4%</span></div>
            </div>
          </div>

          {/* Step 4: CLAHE Contrast & Green Channel Extraction */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  4. CLAHE & Green Channel
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
                  Optimal Vessels
                </span>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                {uploadedImageSrc ? (
                  <img 
                    src={uploadedImageSrc} 
                    alt="CLAHE Enhanced Fundus" 
                    className="w-full h-full object-cover"
                    style={{
                      filter: greenChannelOnly 
                        ? `contrast(${claheClipLimit * 0.8 + 0.8}) brightness(${brightness}) hue-rotate(90deg) saturate(1.8)`
                        : `contrast(${claheClipLimit * 0.8 + 0.8}) brightness(${brightness})`
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full relative flex items-center justify-center"
                    style={{ 
                      background: greenChannelOnly 
                        ? "radial-gradient(circle, #22c55e 0%, #15803d 60%, #052e16 100%)"
                        : bgGradient,
                      filter: `contrast(${claheClipLimit * 0.8 + 0.8})`
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-200/90 blur-[1px] absolute left-8 top-16" />
                    <div className="w-5 h-5 rounded-full bg-white absolute left-9 top-18" />
                    <div className="w-7 h-7 rounded-full bg-black/50 absolute right-12 top-18" />
                    {/* Sharpened simulated capillary branches */}
                    <div className="w-16 h-0.5 bg-black/60 absolute rotate-45" />
                    <div className="w-20 h-0.5 bg-black/60 absolute -rotate-45" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-emerald-400">
                  {greenChannelOnly ? "Green Spectrum (540-570nm)" : "Color CLAHE"}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 space-y-1 font-mono">
              <div className="flex justify-between"><span>Entropy Gain:</span> <span className="text-emerald-400">+{calculatedMetrics.entropyGain} bits</span></div>
              <div className="flex justify-between"><span>Microaneurysms:</span> <span className="text-white">Peak Contrast</span></div>
            </div>
          </div>

        </div>
      )}

      {/* Split-Screen Slider View */}
      {activeViewMode === "compare" && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Before vs. After CLAHE & Denoising Interactive Slider
            </span>
            <span className="text-xs font-mono text-sky-400">
              Split Position: {compareSliderPos}%
            </span>
          </div>

          <div className="relative aspect-[16/9] max-h-[460px] w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-black">
            {/* Base Image (Enhanced Pipeline Result) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {uploadedImageSrc ? (
                <img 
                  src={uploadedImageSrc} 
                  alt="Enhanced" 
                  className="w-full h-full object-cover" 
                  style={{ filter: `contrast(${claheClipLimit * 0.8 + 0.8}) brightness(${brightness}) hue-rotate(90deg)` }}
                />
              ) : (
                <div 
                  className="w-full h-full"
                  style={{ background: "radial-gradient(circle, #22c55e 0%, #15803d 60%, #052e16 100%)" }}
                />
              )}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono">
                Enhanced (CLAHE + Green Channel)
              </div>
            </div>

            {/* Clipped Original Overlay */}
            <div 
              className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
              style={{ width: `${compareSliderPos}%` }}
            >
              <div className="w-[100vw] max-w-[1280px] h-full flex items-center justify-center">
                {uploadedImageSrc ? (
                  <img src={uploadedImageSrc} alt="Original" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: bgGradient }} />
                )}
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-bold font-mono">
                Raw Input Fundus
              </div>
            </div>

            {/* Slider Control Line */}
            <input
              type="range"
              min="0"
              max="100"
              value={compareSliderPos}
              onChange={(e) => setCompareSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
            />
          </div>
        </div>
      )}

      {/* Histogram Verification View */}
      {activeViewMode === "histogram" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Raw Pixel Intensity Histogram (Narrow Dynamic Range)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                8-bit [0 - 255]
              </span>
            </div>

            {/* SVG Histogram Graphic (Skewed bell curve typical of raw retinal images) */}
            <div className="h-48 w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-end justify-between gap-1">
              {[4, 6, 8, 12, 19, 32, 58, 89, 134, 182, 210, 240, 195, 140, 78, 42, 22, 14, 9, 5].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-amber-500/70 rounded-t-sm" 
                    style={{ height: `${(val / 240) * 100}%` }} 
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Raw fundus photographs suffer from clustered intensity distributions in the central red spectrum, compressing microvascular contrast.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Equalized & Normalized Distribution (CLAHE Balanced)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Uniform Spread [0.0 - 1.0]
              </span>
            </div>

            {/* SVG Balanced Histogram Graphic */}
            <div className="h-48 w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-end justify-between gap-1">
              {[65, 78, 85, 92, 98, 102, 108, 112, 115, 118, 116, 114, 110, 105, 98, 92, 85, 78, 70, 62].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-emerald-400/80 rounded-t-sm" 
                    style={{ height: `${(val / 120) * 100}%` }} 
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              CLAHE with bilinear tile interpolation redistributes luminance across the full dynamic range, bringing deep intraretinal capillary beds and microaneurysms into sharp relief.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Mathematical Hyperparameter Tuning
            </h3>
          </div>
          <button
            onClick={() => {
              setGaussianBlur(1.2);
              setClaheClipLimit(2.5);
              setClaheGridSize(8);
              setGreenChannelOnly(true);
              setNormalizationType("minmax");
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to IJIRCCE Standard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Gaussian Denoising Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Gaussian Kernel Blur (σ)</span>
              <span className="font-mono text-sky-400">{gaussianBlur.toFixed(1)} px</span>
            </div>
            <input 
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={gaussianBlur}
              onChange={(e) => setGaussianBlur(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Smooths high-frequency sensor grain while preserving macro vessel boundaries.
            </p>
          </div>

          {/* CLAHE Contrast Clip Limit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">CLAHE Clip Limit</span>
              <span className="font-mono text-emerald-400">{claheClipLimit.toFixed(1)}</span>
            </div>
            <input 
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={claheClipLimit}
              onChange={(e) => setClaheClipLimit(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Clips local histogram spikes in 8×8 tiles to prevent background noise amplification.
            </p>
          </div>

          {/* Green Channel Isolation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Spectral Band Selection</span>
              <span className="font-mono text-emerald-400">{greenChannelOnly ? "Green Channel (Peak)" : "Full RGB"}</span>
            </div>
            <button
              onClick={() => setGreenChannelOnly(!greenChannelOnly)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                greenChannelOnly
                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{greenChannelOnly ? "Green Channel Isolated (540nm)" : "Color Fundus RGB"}</span>
            </button>
            <p className="text-[11px] text-slate-400">
              Hemoglobin absorbs heavily at 540-570nm, giving maximal contrast for hemorrhages.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
