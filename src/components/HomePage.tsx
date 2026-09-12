import React from "react";
import { ArrowRight, ShieldCheck, Activity, Eye, Cpu, Award, FileText, CheckCircle2 } from "lucide-react";
import { IJIRCCE_PAPER } from "../data";

interface HomePageProps {
  onStartAnalysis: () => void;
  onViewPaper: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis, onViewPaper }) => {
  return (
    <div id="home-page-container" className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Paper Accreditation Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>IJIRCCE Indexed Research:</strong> {IJIRCCE_PAPER.title} (Vol. 14, Issue 6, June 2026)
          </span>
        </div>
        <button
          onClick={onViewPaper}
          className="text-sky-300 hover:text-white underline font-medium transition"
        >
          View Paper & Authors (DOI: 10.15680/IJIRCCE.2026.14060104) &rarr;
        </button>
      </div>

      {/* Main Hero Section matching Fig 6.1 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 lg:p-12 shadow-2xl">
        {/* Glow ambient background lights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide uppercase">
              <Eye className="w-3.5 h-3.5" />
              <span>Deep Learning Automated Screening</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                AI-Based Retinal Disease Prediction System
              </h1>
              <p className="text-lg sm:text-xl font-medium text-sky-400">
                Early Detection For Better Tomorrow
              </p>
            </div>

            {/* About Project card directly from Fig 6.1 */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner backdrop-blur-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>About Project</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                This system uses <strong className="text-white font-semibold">Convolutional Neural Network (CNN)</strong> to analyze retinal images and predict the presence of diseases such as <span className="text-sky-300 font-medium">Diabetic Retinopathy</span>, <span className="text-sky-300 font-medium">Hypertension</span>, <span className="text-sky-300 font-medium">Glaucoma</span> and <span className="text-emerald-300 font-medium">Normal conditions</span> with high accuracy.
              </p>
            </div>

            {/* Start Analysis CTA Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="btn-start-analysis"
                onClick={onStartAnalysis}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onViewPaper}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm border border-slate-700 transition"
              >
                <FileText className="w-4 h-4" />
                <span>View Research Paper</span>
              </button>
            </div>
          </div>

          {/* Right Column Graphic representing Fig 6.1 eye image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer pulsing radar rings */}
              <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-25" />
              <div className="absolute inset-4 rounded-full border border-sky-400/30 animate-pulse" />
              <div className="absolute inset-10 rounded-full border border-indigo-500/30" />

              {/* Central Glowing Retinal Eye Disc */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl shadow-sky-500/30 border-4 border-sky-500/60 relative bg-gradient-to-tr from-rose-900 via-orange-800 to-amber-700 flex items-center justify-center">
                {/* Simulated optic nerve glowing center */}
                <div className="absolute left-10 top-20 w-16 h-16 rounded-full bg-amber-200/90 blur-[2px] shadow-inner" />
                <div className="absolute left-12 top-22 w-10 h-10 rounded-full bg-white/90" />

                {/* Vascular network radiating lines */}
                <svg className="absolute inset-0 w-full h-full stroke-red-400/80 fill-none" strokeWidth="2.5">
                  <path d="M 50 85 Q 90 60 140 70 T 200 45" />
                  <path d="M 50 95 Q 100 130 150 140 T 210 160" />
                  <path d="M 50 80 Q 70 30 110 20" />
                  <path d="M 50 100 Q 70 160 100 190" />
                </svg>

                {/* Neural scan grid overlay */}
                <div className="absolute inset-0 bg-sky-950/30 backdrop-blur-[0.5px]" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-sky-400/70 shadow-[0_0_12px_#38bdf8] animate-pulse" />

                {/* Scanning target circle */}
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/70 animate-spin flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Metric chips floating around */}
              <div className="absolute -top-2 right-0 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-emerald-400 shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>96.25% Accuracy</span>
              </div>
              <div className="absolute -bottom-2 left-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-sky-400 shadow-lg flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Non-Invasive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Pillars from the Paper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-semibold text-white text-sm">Image Upload</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Accepts standard digital fundus camera scans, smartphone ophthalmoscope adapters, or live camera streaming.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-semibold text-white text-sm">Automated Preprocessing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Applies Gaussian noise filtering, CLAHE adaptive contrast, green-channel isolation, and pixel normalization.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-semibold text-white text-sm">CNN Feature Extraction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts vascular trees, optic cup-to-disc ratios, microaneurysms, and localized Grad-CAM heatmaps.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            4
          </div>
          <h3 className="font-semibold text-white text-sm">Prediction & Report</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates instant multi-disease classification with confidence scoring and downloadable clinical reports.
          </p>
        </div>
      </div>
    </div>
  );
};
