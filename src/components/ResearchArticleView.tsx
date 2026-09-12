import React from "react";
import { IJIRCCE_PAPER } from "../data";
import { 
  BookOpen, 
  ExternalLink, 
  Download, 
  Award, 
  Calendar, 
  Users, 
  Building2, 
  Hash, 
  FileText,
  CheckCircle2
} from "lucide-react";

export const ResearchArticleView: React.FC = () => {
  return (
    <div id="research-article-container" className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Journal Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white tracking-wide">
              {IJIRCCE_PAPER.journal}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sky-400 font-mono text-[11px]">
            <span>ISSN (Online): {IJIRCCE_PAPER.issnOnline}</span>
            <span>•</span>
            <span>ISSN (Print): {IJIRCCE_PAPER.issnPrint}</span>
            <span>•</span>
            <span>Impact Factor: 8.771</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {IJIRCCE_PAPER.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{IJIRCCE_PAPER.volume}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-sky-400" />
              <span>Pages: {IJIRCCE_PAPER.pageRange}</span>
            </span>
            <span>•</span>
            <span className="font-mono text-sky-400">
              DOI: {IJIRCCE_PAPER.doi}
            </span>
          </div>
        </div>

        {/* Authors and Affiliations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {IJIRCCE_PAPER.authors.map((author, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>{author.name}</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">{author.designation}</p>
              <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{author.institution}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Action Link to Official IJIRCCE Article */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={IJIRCCE_PAPER.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
          >
            <span>Visit IJIRCCE Article Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Abstract & Keywords Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Abstract
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed text-justify">
            {IJIRCCE_PAPER.abstract}
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Keywords:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {IJIRCCE_PAPER.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 text-xs font-medium border border-slate-700/60"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Sections Overview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Paper Outline & Methodological Synthesis
        </h3>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">I. Introduction</h4>
            <p>
              The human retina is a unique anatomical site where microvascular networks can be directly visualized non-invasively. Retinal imaging enables early diagnosis not only for ocular diseases like Diabetic Retinopathy, Glaucoma, and Age-Related Macular Degeneration, but also for systemic vascular manifestations such as Hypertension and cardiovascular conditions.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">II. Existing System & Limitations</h4>
            <p>
              Traditional screening relies on manual ophthalmoscope examination by highly trained retina specialists. Disadvantages include diagnostic subjectivity, inter-observer variability, high consultation costs, and critical shortage of specialists in rural or remote clinical centers.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">III. Proposed System & Advantages</h4>
            <p>
              The proposed system introduces an autonomous, end-to-end deep learning framework utilizing a customized Convolutional Neural Network (CNN). Advantages include non-invasive automated operation, high classification accuracy (96.25%), instant result generation within sub-second latencies, and multi-disease diagnostic capability.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">VI. Results & Experimental Discussion</h4>
            <p>
              The system demonstrates outstanding predictive fidelity across benchmark datasets:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>Figure 6.1:</strong> Home Page — User portal with project scope and CNN overview.</li>
              <li><strong>Figure 6.2:</strong> Image Upload Page — Input pipeline with drag-and-drop and camera acquisition.</li>
              <li><strong>Figure 6.3:</strong> Image Preprocessing Page — Gaussian noise reduction, CLAHE contrast enhancement, and green channel normalization.</li>
              <li><strong>Figure 6.4:</strong> Feature Extraction & CNN Analysis Page — Vessel segmentation, Conv2D feature maps, and Grad-CAM activation heatmaps.</li>
              <li><strong>Figure 6.5:</strong> Disease Prediction Result Page — Dual-pane analyzed view with 96.25% confidence badge and clinical report generation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* References Section from the Paper */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Peer-Reviewed Academic References</span>
        </h3>

        <div className="space-y-2.5 text-xs text-slate-400">
          {IJIRCCE_PAPER.references.map((ref, idx) => (
            <p key={idx} className="leading-relaxed pl-2 border-l-2 border-slate-800 hover:border-sky-500 hover:text-slate-200 transition">
              {ref}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
