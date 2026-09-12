import React, { useState } from "react";
import { IJIRCCE_PAPER } from "../data";
import { 
  Network, 
  UploadCloud, 
  Sliders, 
  Cpu, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  ArrowDown, 
  FileText,
  Eye,
  Activity
} from "lucide-react";

interface SystemArchitectureViewProps {
  onGoToStep: (stepId: string) => void;
}

export const SystemArchitectureView: React.FC<SystemArchitectureViewProps> = ({ onGoToStep }) => {
  const [selectedModule, setSelectedModule] = useState<number>(1);

  const modules = [
    {
      num: 1,
      id: "upload",
      title: "1. Image Upload Module",
      shortDesc: "Acquisition & Formatting",
      longDesc: "Allows users or healthcare professionals to provide retinal fundus images as input. The module accepts digital photographs captured via fundus cameras, smartphone ophthalmoscopes, or live video frames in JPG, PNG, and JPEG formats.",
      substeps: ["Input validation", "Resolution normalization to 512x512", "Color spectrum balance"],
      icon: UploadCloud,
      color: "from-sky-500 to-blue-600"
    },
    {
      num: 2,
      id: "preprocessing",
      title: "2. Image Preprocessing Module",
      shortDesc: "Enhancement & Denoising",
      longDesc: "Enhances the quality of retinal images before convolutional analysis. Operations include 2D Gaussian filtering for noise suppression, Contrast Limited Adaptive Histogram Equalization (CLAHE) for illumination balancing, and green channel extraction for maximal vascular contrast.",
      substeps: ["Gaussian spatial filter (σ=1.5)", "CLAHE contrast limiting", "Green channel 540nm isolation", "Luminance normalization"],
      icon: Sliders,
      color: "from-blue-500 to-indigo-600"
    },
    {
      num: 3,
      id: "cnn-analysis",
      title: "3. Feature Extraction Module",
      shortDesc: "Morphological & Vascular Signs",
      longDesc: "Detects key anatomical biomarkers from the fundus image. Identifies retinal blood vessels, optic disc cup-to-disc ratio (CDR), macula boundaries, microaneurysms, hemorrhages, and drusen accumulations.",
      substeps: ["Blood vessel segmentation tree", "Optic nerve margin tracing", "Macular foveal location", "Lesion pattern clustering"],
      icon: Eye,
      color: "from-indigo-500 to-purple-600"
    },
    {
      num: 4,
      id: "cnn-analysis",
      title: "4. Deep Learning (CNN) Model",
      shortDesc: "Convolutional Classifier",
      longDesc: "The core intelligence engine consisting of multiple Conv2D layers, Batch Normalization, ReLU activation, and MaxPooling layers. Pre-trained and fine-tuned on retinal benchmark datasets to output hierarchical feature vectors.",
      substeps: ["Conv2D feature maps (64/128/256)", "Batch Normalization", "Spatial pooling & dropout", "Dense Softmax probability layer"],
      icon: Cpu,
      color: "from-purple-500 to-pink-600"
    },
    {
      num: 5,
      id: "results",
      title: "5. Disease Prediction Module",
      shortDesc: "Diagnostic Classification",
      longDesc: "Analyzes the high-dimensional feature vectors to predict disease categories: Diabetic Retinopathy, Hypertensive Retinopathy, Glaucoma, Macular Degeneration, Cataract, or Normal, accompanied by rigorous confidence percentages.",
      substeps: ["Class score aggregation", "Differential diagnosis ranking", "Risk stratum calculation", "Clinical threshold validation"],
      icon: Activity,
      color: "from-pink-500 to-rose-600"
    },
    {
      num: 6,
      id: "results",
      title: "6. Result Visualization Module",
      shortDesc: "Grad-CAM & Clinical Report",
      longDesc: "Renders visual Grad-CAM class activation heatmaps showing pathological loci, an interactive SVG retinal marker explorer, and generates downloadable standardized PDF diagnostic reports for ophthalmologists.",
      substeps: ["Grad-CAM attention heatmap overlay", "Interactive anatomical biomarker tags", "PDF clinical report generation", "Screening history persistence"],
      icon: BarChart3,
      color: "from-rose-500 to-emerald-600"
    }
  ];

  const currentMod = modules.find(m => m.num === selectedModule) || modules[0];

  return (
    <div id="system-architecture-container" className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          <Network className="w-4 h-4" />
          <span>IJIRCCE Section IV & Section V</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Fig 4.1: System Architecture & Module Pipeline
        </h2>
        <p className="text-sm text-slate-400">
          Complete schematic flow diagram representing the 6 primary interconnected modules of the AI prediction engine.
        </p>
      </div>

      {/* Interactive Architecture Flow Diagram (Fig 4.1) */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Flow Diagram
          </span>
          <h3 className="text-lg font-bold text-white">
            End-to-End Retinal Disease Diagnostic Pipeline
          </h3>
        </div>

        {/* Responsive Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 pt-4">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = m.num === selectedModule;
            return (
              <div key={m.num} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedModule(m.num)}
                  className={`w-full p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between h-44 group ${
                    isSelected
                      ? "bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-105 z-10"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${m.color} text-white flex items-center justify-center shadow-md mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide block">
                      Module {m.num}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {m.title.replace(`${m.num}. `, "")}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-400 group-hover:text-slate-200">
                    {m.shortDesc}
                  </span>
                </button>

                {/* Arrow connector for desktop */}
                {idx < modules.length - 1 && (
                  <div className="hidden lg:block my-2 text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Module Details Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-black text-sm flex items-center justify-center">
              {currentMod.num}
            </span>
            <h3 className="text-xl font-bold text-white">
              {currentMod.title}
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentMod.longDesc}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technical Operations & Algorithmic Sub-steps:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentMod.substeps.map((sub, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Test Action
            </span>
            <p className="text-xs text-slate-300">
              Launch and test this specific module live in the workspace.
            </p>
          </div>

          <button
            onClick={() => onGoToStep(currentMod.id)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
          >
            <span>Open {currentMod.title.replace(`${currentMod.num}. `, "")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
