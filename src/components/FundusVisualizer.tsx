import React, { useState } from "react";
import { SampleRetinalImage, FundusMarker, LocalizedAbnormality, OpticDiscMetrics, VascularMetrics } from "../types";
import { AlertCircle, CheckCircle2, Eye, Info, Layers, Scan } from "lucide-react";

export interface FundusVisualizerProps {
  sample?: SampleRetinalImage;
  conditionKey?: string;
  activeMarkerId?: string | null;
  onSelectMarker?: (markerId: string | null) => void;
  onMarkerSelect?: (markerId: string | null) => void;
  uploadedImageSrc?: string | null;
  customMarkers?: FundusMarker[];
  markers?: FundusMarker[];
  abnormalities?: LocalizedAbnormality[];
  activeOverlayMode?: "all" | "bounding_boxes" | "vessels" | "optic_cup" | "gradcam" | "raw";
  showGrid?: boolean;
  customOverlayClass?: string;
}

export const FundusVisualizer: React.FC<FundusVisualizerProps> = ({
  sample,
  conditionKey: propConditionKey,
  activeMarkerId,
  onSelectMarker,
  onMarkerSelect,
  uploadedImageSrc,
  customMarkers,
  markers: propMarkers,
  abnormalities: propAbnormalities,
  activeOverlayMode = "all",
  showGrid = true,
  customOverlayClass = ""
}) => {
  const [hoveredItem, setHoveredItem] = useState<{
    id: string;
    title: string;
    description: string;
    confidence?: number;
    severity?: string;
    clinicalSignificance?: string;
    x: number;
    y: number;
  } | null>(null);

  const handleSelect = (id: string | null) => {
    if (onSelectMarker) onSelectMarker(id);
    if (onMarkerSelect) onMarkerSelect(id);
  };

  const effectiveConditionKey = propConditionKey || sample?.conditionKey || "normal";
  const effectiveMarkers: FundusMarker[] = customMarkers || propMarkers || sample?.markers || [];
  const effectiveAbnormalities: LocalizedAbnormality[] = propAbnormalities || sample?.abnormalities || [];
  const opticMetrics: OpticDiscMetrics | undefined = sample?.opticMetrics;
  const vascularMetrics: VascularMetrics | undefined = sample?.vascularMetrics;

  const showBoxes = activeOverlayMode === "all" || activeOverlayMode === "bounding_boxes";
  const showVessels = activeOverlayMode === "all" || activeOverlayMode === "vessels";
  const showOpticCup = activeOverlayMode === "all" || activeOverlayMode === "optic_cup";
  const showGradCam = activeOverlayMode === "all" || activeOverlayMode === "gradcam";

  // Color helper for abnormalities
  const getSeverityColors = (severity: "info" | "warning" | "danger" | undefined, lesionType?: string) => {
    if (lesionType === "microaneurysm" || lesionType === "hemorrhage") {
      return { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.2)", bg: "bg-red-500", text: "text-red-400", border: "border-red-500" };
    }
    if (lesionType === "hard_exudate" || lesionType === "drusen") {
      return { stroke: "#eab308", fill: "rgba(234, 179, 8, 0.2)", bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500" };
    }
    if (lesionType === "optic_cupping" || lesionType === "rim_thinning") {
      return { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.25)", bg: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-500" };
    }
    if (lesionType === "av_nicking" || lesionType === "copper_wiring") {
      return { stroke: "#f97316", fill: "rgba(249, 115, 22, 0.2)", bg: "bg-orange-500", text: "text-orange-400", border: "border-orange-500" };
    }
    if (severity === "danger") {
      return { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.2)", bg: "bg-red-500", text: "text-red-400", border: "border-red-500" };
    }
    if (severity === "warning") {
      return { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500" };
    }
    return { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500" };
  };

  return (
    <div className={`relative w-full aspect-square max-w-[440px] mx-auto select-none ${customOverlayClass}`}>
      {/* Visual Canvas Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 flex items-center justify-center">
        
        {/* Layer 1: Base Retinal Image (Uploaded Photo or SVG Model) */}
        {uploadedImageSrc ? (
          <img
            src={uploadedImageSrc}
            alt="Clinical Fundus Input"
            className="w-full h-full object-cover rounded-full filter contrast-105"
          />
        ) : (
          <svg
            id={`svg-fundus-${effectiveConditionKey}`}
            viewBox="0 0 400 400"
            className="w-full h-full rounded-full overflow-hidden transition-all duration-500"
          >
            <defs>
              <radialGradient id="normalGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7c4d" />
                <stop offset="40%" stopColor="#e04a24" />
                <stop offset="85%" stopColor="#9e2203" />
                <stop offset="100%" stopColor="#4f0d00" />
              </radialGradient>

              <radialGradient id="amdGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff8a5c" />
                <stop offset="45%" stopColor="#e35630" />
                <stop offset="80%" stopColor="#a82103" />
                <stop offset="100%" stopColor="#541002" />
              </radialGradient>

              <radialGradient id="glauGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff8f59" />
                <stop offset="40%" stopColor="#db481f" />
                <stop offset="85%" stopColor="#961f03" />
                <stop offset="100%" stopColor="#4c0e00" />
              </radialGradient>

              <filter id="drusenBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* Retinal Fundus Background Sphere */}
            <circle
              cx="200"
              cy="200"
              r="192"
              fill={
                effectiveConditionKey === "amd"
                  ? "url(#amdGrad)"
                  : effectiveConditionKey === "glaucoma"
                  ? "url(#glauGrad)"
                  : "url(#normalGrad)"
              }
            />

            {/* Optical Grid Reference Rings */}
            {showGrid && (
              <g id="optical-grid-rings" opacity="0.18" stroke="#ffffff" strokeDasharray="3,3">
                <circle cx="200" cy="200" r="60" fill="none" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="120" fill="none" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="180" fill="none" strokeWidth="0.8" />
                <line x1="200" y1="10" x2="200" y2="390" strokeWidth="0.6" />
                <line x1="10" y1="200" x2="390" y2="200" strokeWidth="0.6" />
              </g>
            )}

            {/* ================= OPTIC DISC & CUP (cx=140, cy=200) ================= */}
            <g id="optic-nerve-complex">
              {/* Disc Outer Border */}
              <ellipse
                cx="140"
                cy="200"
                rx={effectiveConditionKey === "glaucoma" ? "34" : "28"}
                ry={effectiveConditionKey === "glaucoma" ? "38" : "32"}
                fill="#ffd394"
                opacity="0.92"
                className="transition-all duration-300"
              />

              {/* Excavated Cup */}
              <ellipse
                cx="144"
                cy="200"
                rx={effectiveConditionKey === "glaucoma" ? "27" : "10"}
                ry={effectiveConditionKey === "glaucoma" ? "31" : "12"}
                fill="#fffae6"
                opacity="0.96"
                className="transition-all duration-300"
              />
            </g>

            {/* ================= MACULA COMPLEX (cx=260, cy=200) ================= */}
            <g id="macular-segment">
              <circle cx="260" cy="200" r="34" fill="#6b1d03" opacity="0.4" />
              <circle
                cx="260"
                cy="200"
                r={effectiveConditionKey === "amd" ? "4" : "1.5"}
                fill={effectiveConditionKey === "amd" ? "#d9b652" : "#ffeedd"}
                opacity={effectiveConditionKey === "amd" ? "0.8" : "0.95"}
              />
            </g>

            {/* ================= RETINAL VASCULATURE TREE ================= */}
            <g id="retinal-vasculature" strokeLinecap="round">
              {/* Superior Temporal Arcade */}
              <path
                d="M 148 180 Q 155 120 210 90 T 310 110"
                stroke="#990000"
                strokeWidth={effectiveConditionKey === "glaucoma" ? "1.8" : "2.6"}
                fill="none"
                opacity="0.95"
              />
              <path
                d="M 148 180 Q 155 120 210 90 T 310 110"
                stroke="#e03716"
                strokeWidth={effectiveConditionKey === "glaucoma" ? "1.0" : "1.5"}
                fill="none"
                opacity="0.9"
              />

              {/* Inferior Temporal Arcade */}
              <path
                d="M 148 220 Q 160 275 220 305 T 315 285"
                stroke="#990000"
                strokeWidth={effectiveConditionKey === "glaucoma" ? "2.0" : "2.8"}
                fill="none"
                opacity="0.95"
              />
              <path
                d="M 148 220 Q 160 275 220 305 T 315 285"
                stroke="#f5401b"
                strokeWidth={effectiveConditionKey === "glaucoma" ? "1.1" : "1.6"}
                fill="none"
                opacity="0.9"
              />

              {/* Nasal Arcades */}
              <path d="M 132 185 Q 100 150 60 140" stroke="#880e00" strokeWidth="2.2" fill="none" />
              <path d="M 132 185 Q 100 150 60 140" stroke="#f03816" strokeWidth="1.2" fill="none" />
              <path d="M 132 215 Q 98 250 55 265" stroke="#880e00" strokeWidth="2.4" fill="none" />
              <path d="M 132 215 Q 98 250 55 265" stroke="#f03816" strokeWidth="1.3" fill="none" />

              {/* Macular Twigs */}
              <path d="M 210 90 Q 235 125 242 160" stroke="#bf2304" strokeWidth="1.2" fill="none" opacity="0.8" />
              <path d="M 220 305 Q 240 265 245 230" stroke="#bf2304" strokeWidth="1.1" fill="none" opacity="0.8" />
            </g>

            {/* ================= PATHOLOGY-SPECIFIC RENDERINGS ================= */}
            {effectiveConditionKey === "diabetic" && (
              <g id="dr-pathology">
                {/* Microaneurysms */}
                <circle cx="168" cy="140" r="2.5" fill="#ff0000" />
                <circle cx="216" cy="140" r="2.8" fill="#ff0000" />
                <circle cx="230" cy="245" r="2.2" fill="#ff0033" />
                <circle cx="170" cy="230" r="3.0" fill="#ee0000" />
                <circle cx="270" cy="155" r="2.6" fill="#ff0000" />
                {/* Cotton wool spots */}
                <circle cx="284" cy="116" r="9" fill="#ffffff" opacity="0.75" filter="url(#drusenBlur)" />
                {/* Hard Exudates */}
                <polygon points="216,232 220,230 223,235 218,236" fill="#ffee55" opacity="0.9" />
                <polygon points="222,238 227,235 229,240 225,241" fill="#ffff33" opacity="0.95" />
                <circle cx="212" cy="232" r="2.4" fill="#ffee44" />
                <circle cx="218" cy="242" r="2.0" fill="#ffee66" />
                <circle cx="228" cy="244" r="2.2" fill="#ffff55" />
                {/* Blot Hemorrhages */}
                <ellipse cx="272" cy="260" rx="6" ry="4" fill="#990000" opacity="0.85" />
                <ellipse cx="132" cy="118" rx="5" ry="3.5" fill="#880000" opacity="0.85" />
              </g>
            )}

            {effectiveConditionKey === "hypertension" && (
              <g id="htn-pathology">
                {/* Flame Hemorrhages */}
                <path d="M 230 150 C 242 148, 258 146, 264 144 C 258 147, 242 152, 230 150 Z" stroke="#b91c1c" strokeWidth="3.5" fill="#dc2626" opacity="0.9" />
                <path d="M 232 248 C 244 256, 256 266, 266 272 C 256 266, 244 256, 232 248 Z" stroke="#b91c1c" strokeWidth="4" fill="#ef4444" opacity="0.85" />
                {/* AV Nicking crossing notches */}
                <circle cx="192" cy="128" r="5" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2,2" />
                <circle cx="208" cy="284" r="5" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2,2" />
                {/* Copper Wiring Stripe */}
                <path d="M 148 185 Q 185 135 250 130" stroke="#f59e0b" strokeWidth="2.2" fill="none" opacity="0.85" />
                <path d="M 148 215 Q 185 275 250 280" stroke="#f59e0b" strokeWidth="2.2" fill="none" opacity="0.85" />
              </g>
            )}

            {effectiveConditionKey === "amd" && (
              <g id="amd-pathology">
                <circle cx="260" cy="200" r="14" fill="#ffe066" opacity="0.6" filter="url(#drusenBlur)" />
                <circle cx="272" cy="192" r="10" fill="#ffff80" opacity="0.5" filter="url(#drusenBlur)" />
                <circle cx="248" cy="208" r="12" fill="#ffe680" opacity="0.55" filter="url(#drusenBlur)" />
                <circle cx="230" cy="170" r="4.5" fill="#ffea75" opacity="0.8" filter="url(#drusenBlur)" />
                <circle cx="282" cy="175" r="4.5" fill="#ffff80" opacity="0.8" filter="url(#drusenBlur)" />
              </g>
            )}
          </svg>
        )}

        {/* Layer 2: Grad-CAM Activation Heatmap Overlay */}
        {showGradCam && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 mix-blend-screen opacity-65"
            style={{
              background:
                effectiveConditionKey === "glaucoma"
                  ? "radial-gradient(circle at 35% 50%, rgba(239, 68, 68, 0.7) 0%, rgba(245, 158, 11, 0.5) 16%, rgba(59, 130, 246, 0.25) 30%, transparent 48%)"
                  : effectiveConditionKey === "diabetic"
                  ? "radial-gradient(circle at 55% 58%, rgba(239, 68, 68, 0.75) 0%, rgba(245, 158, 11, 0.5) 18%, rgba(59, 130, 246, 0.25) 32%, transparent 50%), radial-gradient(circle at 68% 65%, rgba(239, 68, 68, 0.6) 0%, transparent 22%)"
                  : effectiveConditionKey === "hypertension"
                  ? "radial-gradient(circle at 48% 32%, rgba(239, 68, 68, 0.7) 0%, rgba(245, 158, 11, 0.5) 15%, transparent 35%), radial-gradient(circle at 58% 62%, rgba(239, 68, 68, 0.65) 0%, transparent 30%)"
                  : "radial-gradient(circle at 35% 50%, rgba(16, 185, 129, 0.5) 0%, transparent 30%), radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 30%)"
            }}
          />
        )}

        {/* Layer 3: Optic Disc & Cup Contours (Cup-to-Disc Ratio Caliper) */}
        {showOpticCup && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            {/* Optic Disc Outer Contour (Green line) */}
            <ellipse
              cx="140"
              cy="200"
              rx={effectiveConditionKey === "glaucoma" ? "34" : "28"}
              ry={effectiveConditionKey === "glaucoma" ? "38" : "32"}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.8"
              strokeDasharray="4,2"
              className="animate-pulse"
            />
            {/* Optic Cup Inner Contour (Cyan line) */}
            <ellipse
              cx="144"
              cy="200"
              rx={effectiveConditionKey === "glaucoma" ? "27" : "10"}
              ry={effectiveConditionKey === "glaucoma" ? "31" : "12"}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            {/* Vertical Measurement Caliper */}
            <line
              x1="144"
              y1={effectiveConditionKey === "glaucoma" ? 200 - 31 : 200 - 12}
              x2="144"
              y2={effectiveConditionKey === "glaucoma" ? 200 + 31 : 200 + 12}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Horizontal Ticks */}
            <line x1="140" y1={effectiveConditionKey === "glaucoma" ? 200 - 31 : 200 - 12} x2="148" y2={effectiveConditionKey === "glaucoma" ? 200 - 31 : 200 - 12} stroke="#ffffff" strokeWidth="1.5" />
            <line x1="140" y1={effectiveConditionKey === "glaucoma" ? 200 + 31 : 200 + 12} x2="148" y2={effectiveConditionKey === "glaucoma" ? 200 + 31 : 200 + 12} stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        )}

        {/* Layer 4: Interactive Localized Abnormality Bounding Boxes & Clinical Markers */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {/* A. Rich Localized Abnormalities with Bounding Boxes */}
          {showBoxes && effectiveAbnormalities.map((ab) => {
            const isActive = activeMarkerId === ab.id;
            const colors = getSeverityColors(ab.severity, ab.lesionType);
            const boxLeft = Math.max(2, Math.min(92, ab.x - (ab.width || 12) / 2));
            const boxTop = Math.max(2, Math.min(92, ab.y - (ab.height || 12) / 2));
            const boxWidth = ab.width || 12;
            const boxHeight = ab.height || 12;

            return (
              <div
                key={ab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(isActive ? null : ab.id);
                }}
                onMouseEnter={() => {
                  setHoveredItem({
                    id: ab.id,
                    title: ab.label,
                    description: ab.description,
                    confidence: ab.confidence,
                    severity: ab.severity,
                    clinicalSignificance: ab.clinicalSignificance,
                    x: ab.x,
                    y: ab.y
                  });
                }}
                onMouseLeave={() => setHoveredItem(null)}
                className={`absolute cursor-pointer transition-all duration-200 group rounded-sm border-2 ${
                  isActive
                    ? `border-white ring-4 ring-offset-1 ring-offset-slate-900 ring-${colors.bg.replace('bg-', '')} scale-105 z-40`
                    : `${colors.border} hover:border-white z-20`
                }`}
                style={{
                  left: `${boxLeft}%`,
                  top: `${boxTop}%`,
                  width: `${boxWidth}%`,
                  height: `${boxHeight}%`,
                  backgroundColor: colors.fill
                }}
              >
                {/* Clinical Label Tag */}
                <div
                  className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shadow-md pointer-events-none z-30 transition-all ${
                    isActive ? "bg-white text-slate-950 scale-110" : `${colors.bg} text-white group-hover:scale-105`
                  }`}
                >
                  {ab.label}
                  {ab.confidence && <span className="ml-1 opacity-80">({ab.confidence.toFixed(1)}%)</span>}
                </div>

                {/* Corner bracket optical styling */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-white" />

                {/* Center target crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            );
          })}

          {/* B. Legacy / Direct Markers (Pulse targets) if no abnormalities or in complement */}
          {showBoxes && effectiveAbnormalities.length === 0 && effectiveMarkers.map((marker) => {
            const isActive = activeMarkerId === marker.id;
            const colors = getSeverityColors(marker.severity, marker.lesionType);
            const boxW = marker.boxWidth || 14;
            const boxH = marker.boxHeight || 14;
            const boxLeft = Math.max(2, Math.min(92, marker.x - boxW / 2));
            const boxTop = Math.max(2, Math.min(92, marker.y - boxH / 2));

            return (
              <div
                key={marker.id}
                style={{
                  left: `${boxLeft}%`,
                  top: `${boxTop}%`,
                  width: `${boxW}%`,
                  height: `${boxH}%`,
                  backgroundColor: colors.fill
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(isActive ? null : marker.id);
                }}
                onMouseEnter={() => {
                  setHoveredItem({
                    id: marker.id,
                    title: marker.label,
                    description: marker.description,
                    severity: marker.severity,
                    x: marker.x,
                    y: marker.y
                  });
                }}
                onMouseLeave={() => setHoveredItem(null)}
                className={`absolute cursor-pointer rounded-sm border-2 transition-all ${
                  isActive ? "border-white ring-4 ring-cyan-500 scale-105 z-30" : `${colors.border} hover:border-white z-20`
                }`}
              >
                <div className={`absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow ${colors.bg} text-white`}>
                  {marker.label}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} ring-2 ring-white animate-ping`} />
                  <span className={`w-2 h-2 rounded-full ${colors.bg} ring-1 ring-white absolute`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Optical Alignment Reticle HUD */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/70 px-2 py-0.5 rounded-md text-[10px] font-mono text-cyan-400 pointer-events-none">
          <Scan className="w-3 h-3 text-cyan-400" />
          <span>ROI: 512×512 TENSOR</span>
        </div>

        {showOpticCup && opticMetrics && (
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm border border-cyan-500/40 px-2.5 py-1 rounded-md text-[10px] font-mono text-white pointer-events-none shadow-lg">
            <span className="text-cyan-400 font-bold">CDR: </span>
            <span className={opticMetrics.cupToDiscRatio > 0.6 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {opticMetrics.cupToDiscRatio.toFixed(2)}
            </span>
            <span className="text-slate-400 ml-1">
              ({opticMetrics.isntRuleCompliant ? "ISNT Normal" : "ISNT Violated"})
            </span>
          </div>
        )}

        {showVessels && vascularMetrics && (
          <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-sm border border-orange-500/40 px-2.5 py-1 rounded-md text-[10px] font-mono text-white pointer-events-none shadow-lg">
            <span className="text-orange-400 font-bold">A/V Ratio: </span>
            <span className={vascularMetrics.arterioleToVenuleRatio < 0.5 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {vascularMetrics.arterioleToVenuleRatio.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Floating Clinical Tooltip on Hover */}
      {hoveredItem && (
        <div
          className="absolute z-50 pointer-events-none w-64 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-lg p-3 shadow-2xl text-left transition-all duration-150 animate-fade-in"
          style={{
            left: `${Math.min(65, Math.max(10, hoveredItem.x))}%`,
            top: hoveredItem.y > 60 ? `${hoveredItem.y - 30}%` : `${hoveredItem.y + 12}%`
          }}
        >
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="text-xs font-bold text-white leading-tight">{hoveredItem.title}</span>
            {hoveredItem.confidence && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {hoveredItem.confidence.toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">
            {hoveredItem.description}
          </p>
          {hoveredItem.clinicalSignificance && (
            <div className="text-[10px] text-amber-300/90 border-t border-slate-800 pt-1 flex items-start gap-1">
              <Info className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
              <span>{hoveredItem.clinicalSignificance}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
