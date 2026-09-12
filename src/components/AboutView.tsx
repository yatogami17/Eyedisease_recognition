import React from "react";
import { IJIRCCE_PAPER } from "../data";
import { 
  Info, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Network, 
  Sparkles, 
  Award, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Smartphone,
  Cloud,
  FileCheck
} from "lucide-react";

interface AboutViewProps {
  onStartAnalysis: () => void;
  onViewArchitecture: () => void;
  onViewPaper: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onStartAnalysis,
  onViewArchitecture,
  onViewPaper
}) => {
  return (
    <div id="about-page-container" className="p-8 max-w-6xl mx-auto space-y-10 animate-fadeIn">
      {/* Header Banner matching IJIRCCE Paper */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-sky-400 font-semibold">
          <span className="px-2.5 py-1 rounded-md bg-sky-950/80 border border-sky-800/80 uppercase tracking-wider">
            About Project
          </span>
          <span>•</span>
          <span>IJIRCCE Published Research Framework</span>
          <span>•</span>
          <span className="font-mono text-slate-400">DOI: {IJIRCCE_PAPER.doi}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          AI-Based Disease Prediction Using Retinal Images
        </h1>
        <p className="text-base text-slate-300 max-w-4xl leading-relaxed">
          An automated artificial intelligence system using Deep Learning Convolutional Neural Networks (CNN) for non-invasive screening and early identification of Diabetic Retinopathy, Hypertensive Retinopathy, Glaucoma, and normal retinal physiological states.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onStartAnalysis}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
          >
            <span>Launch Retinal Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onViewArchitecture}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Network className="w-4 h-4 text-sky-400" />
            <span>View Fig 4.1 System Architecture</span>
          </button>
          <button
            onClick={onViewPaper}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Read Published Article</span>
          </button>
        </div>
      </div>

      {/* Section I: Introduction */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Section I • Introduction</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          Clinical Significance of Retinal Imaging
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed text-justify">
          The human retina contains a rich network of blood vessels and neural tissues that reflect various systemic health conditions. Changes in retinal structures can indicate the presence of diseases such as diabetes, cardiovascular disorders, hypertension, and certain neurological conditions. Traditional diagnostic methods rely on manual examination by specialists, which can be time-consuming and may lead to subjective interpretation. Therefore, there is a crucial need for an automated and accurate diagnostic system for early detection and effective disease management.
        </p>
      </div>

      {/* Comparison: Existing System vs Proposed System (Section II & III) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section II: Existing System & Disadvantages */}
        <div className="p-6 rounded-2xl bg-red-950/15 border border-red-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>Section II • Existing System & Limitations</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Traditional Manual Screening
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Relies mainly on manual examination by ophthalmologists and medical experts. Doctors visually analyze retinal fundus images to identify abnormalities such as changes in blood vessels and lesions.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
              Disadvantages Identified in Paper:
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>Relies heavily on manual examination by ophthalmologists and medical experts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>Time-consuming process as each retinal image must be analyzed visually.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>Requires high level of expertise and experience for accurate diagnosis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>Prone to human errors and inconsistencies due to subjective interpretation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>High cost and limited availability in rural or underserved healthcare areas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section III: Proposed System & Advantages */}
        <div className="p-6 rounded-2xl bg-emerald-950/15 border border-emerald-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Section III • Proposed System & Advantages</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Automated Deep Learning Framework
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The proposed system introduces an automated disease prediction model using Artificial Intelligence and deep learning techniques. A Convolutional Neural Network (CNN) is used to analyze retinal images through preprocessing, feature extraction, and classification.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Advantages Documented in Paper:
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Automated, non-invasive early disease prediction directly from fundus photography.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Reduces manual effort while improving diagnostic speed and consistency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Enables early detection of subtle abnormalities missed in manual examination.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Empowered by 96.25% classification confidence score.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>Scalable and efficient screening suitable for widespread healthcare applications.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section IV & V: System Architecture & Modules */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Section IV & V • Core Architecture
            </span>
            <h3 className="text-xl font-bold text-white">
              6 Interconnected Architectural Modules
            </h3>
          </div>
          <button
            onClick={onViewArchitecture}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30 transition"
          >
            <span>Interactive Schematic (Fig 4.1)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 1: Image Upload</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides retinal fundus images as input (JPG, PNG, JPEG, camera stream) meeting standard resolution specifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 2: Image Preprocessing</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enhances image quality via Gaussian noise reduction, CLAHE contrast enhancement, green channel isolation, and normalization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 3: Feature Extraction</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Extracts blood vessel branches, optic disc cup-to-disc ratio (CDR), macula boundaries, microaneurysms, and hemorrhages.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 4: Deep Learning (CNN)</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Convolutional Neural Network with hierarchical Conv2D, Batch Normalization, MaxPooling, and Dense classification layers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 5: Disease Prediction</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Predicts likelihood of Diabetic Retinopathy, Hypertensive Retinopathy, Glaucoma, and Normal states with 96.25% confidence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <span className="text-xs font-bold text-sky-400">Module 6: Result Visualization</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Displays Grad-CAM activation heatmaps, anatomical biomarker tags, and exports standardized clinical ophthalmic reports.
            </p>
          </div>
        </div>
      </div>

      {/* Section VIII: Future Enhancements */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Section VIII • Future Enhancements</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          Roadmap for Advanced Clinical Translation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">1. Vision Transformers (ViT) & EfficientNet</strong>
              <span>Incorporation of hybrid transformer-CNN backbones to enhance global spatial feature attention and predictive accuracy.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">2. Mobile Ophthalmic Screening</strong>
              <span>Deployment of lightweight quantized ONNX/TensorFlow Lite models for smartphone-attached fundus cameras in rural clinics.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">3. Explainable AI (XAI)</strong>
              <span>Integration of SHAP, LIME, and multi-scale Grad-CAM++ to provide transparent visual justifications for ophthalmologists.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <Cloud className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">4. Telemedicine & EHR Integration</strong>
              <span>Direct HL7/FHIR compatibility with electronic health records for seamless screening workflows and automated referrals.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authors & Institutional Details from Paper Page 1 & 2 */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          <span>Research Authors & Institutional Affiliation</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {IJIRCCE_PAPER.authors.map((author, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
              <div className="text-sm font-bold text-white">{author.name}</div>
              <p className="text-sky-400 font-medium">{author.designation}</p>
              <p className="text-slate-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{author.institution}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
