import React, { useState, useEffect } from "react";
import { SampleRetinalImage } from "../types";
import { 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Eye, 
  Zap, 
  Sparkles,
  Terminal,
  Clock
} from "lucide-react";

interface CnnAnalysisPageProps {
  selectedSample: SampleRetinalImage;
  uploadedImageSrc: string | null;
  onProceedToResults: () => void;
  isProcessing: boolean;
}

export const CnnAnalysisPage: React.FC<CnnAnalysisPageProps> = ({
  selectedSample,
  uploadedImageSrc,
  onProceedToResults,
  isProcessing: externalProcessing
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing CNN Deep Learning Model...");
  const [isCompleted, setIsCompleted] = useState(false);

  // Simulated CNN forward-pass lifecycle
  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p <= 20) {
        setProgress(p);
        setCurrentStep("Extracting retinal blood vessels (Morphological Gabor Filter)...");
      } else if (p <= 45) {
        setProgress(p);
        setCurrentStep("Passing through Conv2D Layer 1 & 2 (Feature Maps 64/128 channels)...");
      } else if (p <= 70) {
        setProgress(p);
        setCurrentStep("Generating Grad-CAM Activation Class Heatmaps (Optic Disc & Macula)...");
      } else if (p <= 90) {
        setProgress(p);
        setCurrentStep("Executing Softmax Dense Layers for multi-disease probabilities...");
      } else {
        setProgress(100);
        setCurrentStep("CNN Analysis Complete! 96.25% Confidence Achieved.");
        setIsCompleted(true);
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [selectedSample, uploadedImageSrc]);

  const bgGradient = selectedSample.primaryBgColor;

  return (
    <div id="cnn-analysis-container" className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header matching Fig 6.4 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Feature Extraction & CNN Analysis
          </h2>
          <p className="text-sm text-slate-400">
            Modules 3 & 4: Deep Learning Convolutional Network (Vessel Segmentation, Conv Feature Maps, Grad-CAM).
          </p>
        </div>

        <button
          id="btn-view-prediction-results"
          onClick={onProceedToResults}
          disabled={!isCompleted && progress < 100}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            isCompleted || progress === 100
              ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30 hover:scale-[1.02]"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>View Prediction Results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time CNN Processing Status Box matching Fig 6.4 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Cpu className={`w-4 h-4 ${isCompleted ? "text-emerald-400" : "animate-spin"}`} />
            <span>
              {isCompleted ? "CNN Processing Completed" : "CNN Processing... Please wait"}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted 
                ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" 
                : "bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_12px_#38bdf8]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Step description */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-slate-300">{currentStep}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Model: Deep 2D-CNN (IJIRCCE Architecture)
          </span>
        </div>
      </div>

      {/* 4 Feature Panels Display matching Fig 6.4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Panel 1: Input Image */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              1. Input Image
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Normalized
            </span>
          </div>

          <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
            {uploadedImageSrc ? (
              <img src={uploadedImageSrc} alt="Input Retinal Scan" className="w-full h-full object-cover" />
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
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] text-white">
              512 x 512 Tensor
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Preprocessed fundus matrix fed to input layer with pixel intensity normalization [0, 1].
          </p>
        </div>

        {/* Panel 2: Blood Vessel Detection */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              2. Blood Vessel Detection
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
              Vasculature Mask
            </span>
          </div>

          {/* Retinal Vasculature Segmentation Tree */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-emerald-500/30 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full p-2 bg-black">
              {/* Central vascular trunk */}
              <circle cx="70" cy="100" r="14" fill="#003311" stroke="#00ff66" strokeWidth="1" />
              <ellipse cx="72" cy="100" r="8" fill="#000000" stroke="#00ff88" strokeWidth="1" />

              {/* Superior Temporal branch */}
              <path d="M 70 92 Q 85 60 120 45 T 180 35" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M 120 45 Q 140 25 170 15" fill="none" stroke="#34d399" strokeWidth="1.8" />
              <path d="M 100 55 Q 115 70 140 75" fill="none" stroke="#6ee7b7" strokeWidth="1.2" />

              {/* Inferior Temporal branch */}
              <path d="M 70 108 Q 85 140 125 155 T 185 165" fill="none" stroke="#10b981" strokeWidth="3.2" />
              <path d="M 125 155 Q 145 175 175 185" fill="none" stroke="#34d399" strokeWidth="1.8" />
              <path d="M 105 145 Q 120 130 145 125" fill="none" stroke="#6ee7b7" strokeWidth="1.2" />

              {/* Nasal branches */}
              <path d="M 62 96 Q 40 85 20 80" fill="none" stroke="#10b981" strokeWidth="2.2" />
              <path d="M 62 104 Q 40 115 15 120" fill="none" stroke="#10b981" strokeWidth="2.2" />

              {/* Micro-vascular capillaries */}
              <path d="M 140 50 Q 155 58 170 65" fill="none" stroke="#a7f3d0" strokeWidth="0.8" />
              <path d="M 145 150 Q 160 142 175 135" fill="none" stroke="#a7f3d0" strokeWidth="0.8" />
            </svg>

            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold">
              Vascular Segmentation Map
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Morphological vessel tree segmentation reveals microvascular tortuosity, caliber narrowing, and AV crossing.
          </p>
        </div>

        {/* Panel 3: Feature Map (CNN) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              3. Feature Map (CNN)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold">
              Conv2D Layers
            </span>
          </div>

          {/* CNN Filter Channel Grid (Conv2D activation filters) */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-sky-500/30 p-2 grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((filterIdx) => (
              <div 
                key={filterIdx} 
                className="rounded bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center"
              >
                {/* Visual filter representation */}
                <div 
                  className="w-full h-full opacity-80"
                  style={{
                    background: `radial-gradient(circle at ${filterIdx * 10}%, #0284c7 0%, #0369a1 40%, #082f49 100%)`,
                    filter: `contrast(${1 + filterIdx * 0.1})`
                  }}
                />
                <span className="absolute bottom-0.5 right-1 font-mono text-[8px] text-sky-300">
                  F{filterIdx}
                </span>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-slate-900/90 border border-sky-500/40 text-[10px] text-sky-300 font-semibold">
              Layer 3 Conv Channels
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hierarchical latent feature maps capturing edges, optical disc margins, microaneurysms, and drusen textures.
          </p>
        </div>

        {/* Panel 4: Activation Heatmap (Grad-CAM) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              4. Activation Heatmap
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">
              Grad-CAM
            </span>
          </div>

          {/* Grad-CAM Heatmap overlay */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-rose-500/30 flex items-center justify-center">
            {uploadedImageSrc ? (
              <img src={uploadedImageSrc} alt="Input Under Heatmap" className="w-full h-full object-cover opacity-60" />
            ) : (
              <div className="w-full h-full opacity-60" style={{ background: bgGradient }} />
            )}

            {/* Simulated Grad-CAM pseudo-color heat blobs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-red-600/60 blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-yellow-400/60 blur-lg" />
              <div className="w-10 h-10 rounded-full bg-white/80 blur-md" />
            </div>

            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] text-rose-300 font-semibold">
              High Attention Gradient
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Grad-CAM heatmap pinpoints the exact pathological clusters guiding the deep neural network's final diagnosis.
          </p>
        </div>
      </div>

      {/* Model Specifications from the Paper */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            <strong>Architecture:</strong> Sequential 2D-CNN with Conv2D (3x3), Batch Normalization, ReLU, MaxPool (2x2), and Dense Softmax.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <span>Parameters: ~14.2M</span>
          <span>•</span>
          <span>Inference Latency: 142ms</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Validation Accuracy: 96.25%</span>
        </div>
      </div>
    </div>
  );
};
