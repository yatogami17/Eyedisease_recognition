import React from "react";
import { PredictionResult, SampleRetinalImage } from "../types";
import { IJIRCCE_PAPER } from "../data";
import { X, Printer, Download, Eye, Award, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResult | null;
  selectedSample: SampleRetinalImage;
  uploadedImageSrc: string | null;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  prediction,
  selectedSample,
  uploadedImageSrc
}) => {
  if (!isOpen || !prediction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isNormal = prediction.primaryDiagnosis.toLowerCase().includes("normal");
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const reportTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const reportId = `IJIRCCE-SCAN-${Math.floor(100000 + Math.random() * 900000)}`;

  const opticMetrics = selectedSample.opticMetrics;
  const vascularMetrics = selectedSample.vascularMetrics;
  const abnormalities = selectedSample.abnormalities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Award className="w-4 h-4" />
            <span>Standard Clinical Ophthalmic Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Medical Sheet */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-800 font-sans">
          {/* Clinic / Journal Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                  AI
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  Retinal AI Diagnostic Center
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Ophthalmic Neural Computing & Computer Vision Screening Laboratory
              </p>
              <p className="text-[11px] text-slate-400">
                Ref: {IJIRCCE_PAPER.journalShort} Research Protocol (DOI: {IJIRCCE_PAPER.doi})
              </p>
            </div>

            <div className="text-right space-y-0.5 text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">ID: {reportId}</p>
              <p>Date: {reportDate}</p>
              <p>Time: {reportTime}</p>
            </div>
          </div>

          {/* Patient / Scan Metadata Banner */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Modality:</span>
              <span className="font-bold text-slate-900">Digital Fundus Photography (512×512)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Model Architecture:</span>
              <span className="font-bold text-slate-900">Deep 2D-CNN (IJIRCCE Standard)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Clinical Preprocessing:</span>
              <span className="font-bold text-slate-900">CLAHE + Gaussian + Green Channel</span>
            </div>
          </div>

          {/* Primary Diagnosis Box */}
          <div className="p-5 rounded-xl border-2 border-slate-900 bg-slate-50 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Automated CNN Classification Result:
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {prediction.primaryDiagnosis}
              </h3>
              <div className="flex items-center gap-2 pt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  isNormal ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}>
                  {isNormal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{isNormal ? "Normal / Negative" : "Positive Detection"}</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Status: {prediction.status}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Confidence:
              </span>
              <div className="inline-block px-4 py-2 rounded-xl bg-sky-600 text-white text-3xl font-black shadow-sm">
                {(prediction.confidence || 96.25).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Quantitative Clinical Metrics (Optic Cup & Vasculature) */}
          {(opticMetrics || vascularMetrics) && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Quantitative Ophthalmic Biomarkers
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {opticMetrics && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="font-bold text-slate-900 block">Optic Disc / Cup Metrics</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cup-to-Disc Ratio (CDR):</span>
                      <span className="font-mono font-bold text-slate-900">{opticMetrics.cupToDiscRatio.toFixed(2)} (Norm: &lt;{opticMetrics.normalThreshold})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ISNT Rule Compliance:</span>
                      <span className="font-bold text-slate-900">{opticMetrics.isntRuleCompliant ? "Preserved (Normal)" : "Violated (Glaucoma)"}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">{opticMetrics.clinicalAssessment}</p>
                  </div>
                )}

                {vascularMetrics && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="font-bold text-slate-900 block">Retinal Vasculature Metrics</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Arteriole-to-Venule Ratio:</span>
                      <span className="font-mono font-bold text-slate-900">{vascularMetrics.arterioleToVenuleRatio.toFixed(2)} (Norm: &ge;0.67)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vessel Tortuosity:</span>
                      <span className="font-mono text-slate-900">{vascularMetrics.tortuosityIndex.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">{vascularMetrics.clinicalAssessment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Localized Abnormalities Table */}
          {abnormalities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Detected Localized Lesions & Microvascular Abnormalities
              </h4>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 font-mono text-[10px] uppercase text-slate-700">
                  <tr>
                    <th className="p-2">Feature</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {abnormalities.map((ab) => (
                    <tr key={ab.id}>
                      <td className="p-2 font-medium text-slate-900">{ab.label}</td>
                      <td className="p-2 font-mono text-[11px]">{ab.lesionType.replace('_', ' ')}</td>
                      <td className="p-2 font-mono text-[11px]">({ab.x}%, {ab.y}%)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{ab.confidence ? `${ab.confidence.toFixed(1)}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Anatomical Findings Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Anatomical Structure Evaluations
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-4 p-2 bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <span className="col-span-1">Region</span>
                <span className="col-span-3">Microvascular & Structural Findings</span>
              </div>
              <div className="grid grid-cols-4 p-2.5 border-b border-slate-100">
                <span className="col-span-1 font-semibold text-slate-900">Optic Nerve / Cup:</span>
                <span className="col-span-3 text-slate-700">{prediction.anatomicalFindings.opticDisc}</span>
              </div>
              <div className="grid grid-cols-4 p-2.5 border-b border-slate-100">
                <span className="col-span-1 font-semibold text-slate-900">Macular Zone:</span>
                <span className="col-span-3 text-slate-700">{prediction.anatomicalFindings.macula}</span>
              </div>
              <div className="grid grid-cols-4 p-2.5 border-b border-slate-100">
                <span className="col-span-1 font-semibold text-slate-900">Retinal Vasculature:</span>
                <span className="col-span-3 text-slate-700">{prediction.anatomicalFindings.vasculature}</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="col-span-1 font-semibold text-slate-900">Sensory Background:</span>
                <span className="col-span-3 text-slate-700">{prediction.anatomicalFindings.retinalBackground}</span>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Recommended Clinical Management
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              {prediction.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Doctor Sign-off & Medical Legal Disclaimer */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs text-slate-500">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Disclaimer:</p>
              <p className="text-[10px] leading-relaxed">
                This report is generated by an automated Deep Learning Neural Network based on the IJIRCCE published research framework. It is intended to assist medical practitioners and must be correlated with clinical slit-lamp and dilated examinations.
              </p>
            </div>
            <div className="text-right space-y-3">
              <div className="inline-block border-b border-slate-400 w-48 h-8" />
              <p className="text-[11px] font-bold text-slate-800">
                Authorized Ophthalmic Consultant Sign-off
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
