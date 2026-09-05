import React from "react";
import { SampleRetinalImage, FundusMarker } from "../types";

interface FundusVisualizerProps {
  sample: SampleRetinalImage;
  activeMarkerId: string | null;
  onSelectMarker: (markerId: string | null) => void;
  uploadedImageSrc?: string | null;
  customMarkers?: FundusMarker[];
}

export const FundusVisualizer: React.FC<FundusVisualizerProps> = ({
  sample,
  activeMarkerId,
  onSelectMarker,
  uploadedImageSrc,
  customMarkers
}) => {
  const { conditionKey, markers } = sample;

  // Render interactive SVG Fundus simulation
  const renderFundusSVG = () => {
    // Shared blood vessel paths radiating from the Optic Disc (cx=35%, cy=50%, i.e., x=140, y=200 inside 400x400)
    // 400x400 viewBox
    return (
      <svg
        id={`svg-fundus-${conditionKey}`}
        viewBox="0 0 400 400"
        className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 transition-all duration-500"
      >
        <defs>
          {/* Radial Gradient for healthy vs diseased retina backgrounds */}
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

          {/* Blur filters for diseased regions */}
          <filter id="drusenBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          
          <filter id="cataractHaze" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Global Retinal Sphere Circle */}
        <circle
          cx="200"
          cy="200"
          r="190"
          fill={
            conditionKey === "amd"
              ? "url(#amdGrad)"
              : conditionKey === "glaucoma"
              ? "url(#glauGrad)"
              : "url(#normalGrad)"
          }
          className="transition-all duration-700"
        />

        {/* ================= OPTIC DISC & CUP ================= */}
        <g id="optic-nerve-complex">
          {/* Optic Disc outer boundary (cx=140, cy=200 for nasal offset, representing right eye layout) */}
          <ellipse
            cx="140"
            cy="200"
            rx={conditionKey === "glaucoma" ? "34" : "28"}
            ry={conditionKey === "glaucoma" ? "38" : "32"}
            fill="#ffd394"
            opacity="0.9"
            className="transition-all duration-500"
          />

          {/* Optic Cup (Excavation) inside the disc. Critically high vertical ratio in glaucoma */}
          <ellipse
            cx="144"
            cy="200"
            rx={conditionKey === "glaucoma" ? "27" : "10"}
            ry={conditionKey === "glaucoma" ? "31" : "12"}
            fill="#fffae6"
            opacity="0.95"
            className="transition-all duration-500"
          />
        </g>

        {/* ================= MACULA COMPLEX (cx=260, cy=200) ================= */}
        <g id="macular-segment">
          {/* Muted dark shaded circle for healthy macula background */}
          <circle
            cx="260"
            cy="200"
            r="35"
            fill="#6b1d03"
            opacity="0.4"
          />
          {/* Foveal Center Reflex dot */}
          <circle
            cx="260"
            cy="200"
            r={conditionKey === "amd" ? "4" : "1.5"}
            fill={conditionKey === "amd" ? "#d9b652" : "#ffeedd"}
            opacity={conditionKey === "amd" ? "0.8" : "0.95"}
          />
        </g>

        {/* ================= VASCULAR SYSTEM ================= */}
        {/* Branching arterioles (red/orange) and venules (deep dark crimson) */}
        <g id="retinal-vasculature" strokeLinecap="round">
          {/* Superior Temporal Arcade Vessel */}
          <path
            d="M 148 180 Q 155 120 210 90 T 310 110"
            stroke="#aa1100"
            strokeWidth={conditionKey === "glaucoma" ? "1.8" : "2.5"}
            fill="none"
            opacity={conditionKey === "glaucoma" ? "0.6" : "0.95"}
            className="transition-all duration-500"
          />
          <path
            d="M 148 180 Q 155 120 210 90 T 310 110"
            stroke="#e03716"
            strokeWidth={conditionKey === "glaucoma" ? "1" : "1.5"}
            fill="none"
            opacity={conditionKey === "glaucoma" ? "0.5" : "0.95"}
            className="transition-all duration-500"
          />

          {/* Inferior Temporal Arcade Vessel */}
          <path
            d="M 148 220 Q 160 275 220 305 T 315 285"
            stroke="#b31500"
            strokeWidth={conditionKey === "glaucoma" ? "2" : "2.8"}
            fill="none"
            opacity={conditionKey === "glaucoma" ? "0.6" : "0.95"}
          />
          <path
            d="M 148 220 Q 160 275 220 305 T 315 285"
            stroke="#f5401b"
            strokeWidth={conditionKey === "glaucoma" ? "1.2" : "1.6"}
            fill="none"
            opacity={conditionKey === "glaucoma" ? "0.5" : "0.95"}
          />

          {/* Nasal Venules & Arterioles (Branching Left) */}
          <path d="M 132 185 Q 100 150 60 140" stroke="#940f00" strokeWidth="2.2" fill="none" />
          <path d="M 132 185 Q 100 150 60 140" stroke="#f03816" strokeWidth="1.2" fill="none" />
          <path d="M 132 215 Q 98 250 55 265" stroke="#940f00" strokeWidth="2.4" fill="none" />
          <path d="M 132 215 Q 98 250 55 265" stroke="#f03816" strokeWidth="1.3" fill="none" />

          {/* Small macular twigs radiating towards macula (cx=260) */}
          <path d="M 210 90 Q 235 125 242 160" stroke="#bf2304" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path d="M 220 305 Q 240 265 245 230" stroke="#bf2304" strokeWidth="1.1" fill="none" opacity="0.8" />
        </g>

        {/* ================= CONDITION-SPECIFIC OVERLAYS ================= */}

        {/* 1. DIABETIC RETINOPATHY LESIONS */}
        {conditionKey === "diabetic" && (
          <g id="dr-pathology">
            {/* scattered tiny microaneurysms (bright red dots) */}
            <circle cx="210" cy="140" r="2.5" fill="#ff0000" />
            <circle cx="230" cy="245" r="2" fill="#ff0055" />
            <circle cx="170" cy="230" r="3" fill="#ee0000" />
            <circle cx="158" cy="110" r="2" fill="#ff0000" />
            <circle cx="185" cy="75" r="2.5" fill="#ee0000" />
            <circle cx="280" cy="160" r="2.2" fill="#ff0000" />
            <circle cx="295" cy="240" r="3" fill="#ff0033" />

            {/* Cotton wool spots (soft white clouds) */}
            <circle cx="285" cy="115" r="8" fill="#ffffff" opacity="0.72" filter="url(#drusenBlur)" />
            <circle cx="180" cy="265" r="6" fill="#ffffff" opacity="0.65" filter="url(#drusenBlur)" />

            {/* Hard exudate lipid clusters (yellow crisp specs) */}
            <polygon points="208,230 212,228 214,233 210,234" fill="#ffee55" opacity="0.9" />
            <polygon points="214,236 218,233 221,238 217,239" fill="#ffff33" opacity="0.9" />
            <polygon points="205,241 210,239 211,244 207,245" fill="#ffee22" opacity="0.85" />
            <circle cx="225" cy="235" r="2.2" fill="#ffee66" opacity="0.9" />
            <circle cx="222" cy="241" r="1.8" fill="#ffff55" opacity="0.9" />
            
            {/* Exudates clustered around macular temporal boundaries */}
            <circle cx="206" cy="165" r="1.5" fill="#ffff44" />
            <circle cx="202" cy="172" r="2.2" fill="#ffff55" />
            <circle cx="209" cy="174" r="1.8" fill="#ffee66" />
            <circle cx="213" cy="169" r="2" fill="#ffee33" />
            
            {/* Blot Hemorrhages (larger irregular red patches) */}
            <path d="M 270 260 Q 274 256 278 262 T 273 268 Z" fill="#aa0000" opacity="0.85" />
            <path d="M 130 115 Q 134 112 138 116 T 132 121 Z" fill="#990000" opacity="0.85" />
            <path d="M 290 85 Q 296 82 294 88 T 288 89 Z" fill="#aa0000" opacity="0.8" />
          </g>
        )}

        {/* 2. MACULAR DEGENERATION (SOFT DRUSEN CLUSTERS) */}
        {conditionKey === "amd" && (
          <g id="amd-pathology">
            {/* Massive accumulation of fuzzy soft drusen centered precisely on Macula (cx=260, cy=200) */}
            <circle cx="260" cy="200" r="14" fill="#ffe066" opacity="0.6" filter="url(#drusenBlur)" />
            <circle cx="272" cy="192" r="10" fill="#ffff80" opacity="0.5" filter="url(#drusenBlur)" />
            <circle cx="248" cy="208" r="12" fill="#ffe680" opacity="0.55" filter="url(#drusenBlur)" />
            <circle cx="254" cy="184" r="11" fill="#ffe066" opacity="0.6" filter="url(#drusenBlur)" />
            <circle cx="270" cy="212" r="10" fill="#ffff99" opacity="0.45" filter="url(#drusenBlur)" />
            
            {/* Scattered medium discrete drusen */}
            <circle cx="230" cy="170" r="4" fill="#ffea75" opacity="0.8" filter="url(#drusenBlur)" />
            <circle cx="238" cy="225" r="4.5" fill="#fff294" opacity="0.8" filter="url(#drusenBlur)" />
            <circle cx="285" cy="220" r="5" fill="#ffe04d" opacity="0.75" filter="url(#drusenBlur)" />
            <circle cx="282" cy="175" r="4" fill="#ffff80" opacity="0.8" filter="url(#drusenBlur)" />
            <circle cx="242" cy="195" r="3.5" fill="#ffdd44" opacity="0.85" filter="url(#drusenBlur)" />
            <circle cx="266" cy="204" r="3" fill="#ffffff" opacity="0.9" />
          </g>
        )}

        {/* 3. CATARACT CLOUDY LENS OVERLAY (Covers entire screen to simulate opacification) */}
        {conditionKey === "cataract" && (
          <g id="cataract-pathology">
            {/* Concentric opacity circles representing varying lens nuclear cloudiness */}
            <circle cx="200" cy="200" r="186" fill="#eef2f5" opacity="0.48" />
            <circle cx="200" cy="200" r="140" fill="#fdfdfd" opacity="0.18" />
            <circle cx="180" cy="180" r="100" fill="#e8eff5" opacity="0.15" />
            {/* Dusty scatter flares */}
            <path d="M 60 100 Q 200 200 340 100" stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.1" />
            <path d="M 80 320 Q 200 200 320 320" stroke="#ffffff" strokeWidth="12" fill="none" opacity="0.08" />
          </g>
        )}

        {/* ================= RENDERING INTERACTIVE MARKERS ================= */}
        <g id="interactive-marker-anchors">
          {markers.map((marker) => {
            const screenX = (marker.x / 100) * 400;
            const screenY = (marker.y / 100) * 400;
            const isActive = marker.id === activeMarkerId;
            
            // Set marker color scheme
            const ringColor = 
              marker.severity === "danger" 
                ? "stroke-red-500 fill-red-500" 
                : marker.severity === "warning"
                ? "stroke-amber-500 fill-amber-500"
                : "stroke-sky-400 fill-sky-400";

            return (
              <g
                key={marker.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMarker(isActive ? null : marker.id);
                }}
              >
                {/* Flashing/pulsing outer beacon effect */}
                <circle
                  cx={screenX}
                  cy={screenY}
                  r={isActive ? "16" : "11"}
                  className={`fill-none pointer-events-none transition-all duration-300 stroke-2 opacity-60 animate-ping`}
                  style={{
                    animationDuration: isActive ? "1.5s" : "2.5s",
                    stroke: marker.severity === "danger" 
                      ? "#ef4444" 
                      : marker.severity === "warning"
                      ? "#f59e0b"
                      : "#38bdf8"
                  }}
                />
                
                {/* Thick hover outline */}
                <circle
                  cx={screenX}
                  cy={screenY}
                  r="14"
                  fill="transparent"
                  className="stroke-transparent group-hover:stroke-white/30 stroke-2 transition-colors duration-150"
                />

                {/* Main Marker core circle */}
                <circle
                  cx={screenX}
                  cy={screenY}
                  r="7.5"
                  className={`${ringColor} ${
                    isActive ? "scale-125" : "hover:scale-110"
                  } transition-transform duration-200 stroke-white stroke-1 shadow-md`}
                />

                {/* Central white core */}
                <circle
                  cx={screenX}
                  cy={screenY}
                  r="2.5"
                  fill="#ffffff"
                />
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto select-none">
      {uploadedImageSrc ? (
        // Mode 2: User uploaded their own image cleanly
        <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-slate-700 bg-slate-900 flex items-center justify-center relative">
          <img
            src={uploadedImageSrc}
            alt="User uploaded retinal fundus"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none rounded-full flex flex-col justify-end items-center p-6 text-center">
            <span className="text-white text-xs font-mono tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-700 uppercase">
              Captured scan analysis
            </span>
          </div>

          {/* Absolute svg overlay for round red circles identifying affected areas */}
          {customMarkers && customMarkers.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden animate-fade-in"
              viewBox="0 0 400 400"
            >
              <g id="custom-vision-circles">
                {customMarkers.map((marker) => {
                  const screenX = (marker.x / 100) * 400;
                  const screenY = (marker.y / 100) * 400;
                  const isActive = marker.id === activeMarkerId;

                  return (
                    <g
                      key={marker.id}
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMarker(isActive ? null : marker.id);
                      }}
                    >
                      {/* Flashing/pulsing red outer circle marker */}
                      <circle
                        cx={screenX}
                        cy={screenY}
                        r={isActive ? "18" : "12"}
                        className="fill-none pointer-events-none transition-all duration-300 stroke-2 opacity-80 animate-ping"
                        style={{
                          animationDuration: isActive ? "1.2s" : "2.2s",
                          stroke: "#ef4444"
                        }}
                      />

                      {/* Hover Target ring */}
                      <circle
                        cx={screenX}
                        cy={screenY}
                        r="16"
                        fill="transparent"
                        className="stroke-transparent group-hover:stroke-red-500/40 stroke-2 transition-colors duration-150"
                      />

                      {/* Main solid red diagnostic dot */}
                      <circle
                        cx={screenX}
                        cy={screenY}
                        r="8"
                        fill="#ef4444"
                        className={`transition-transform duration-200 stroke-white stroke-1 shadow-lg ${
                          isActive ? "scale-125" : "hover:scale-115"
                        }`}
                      />

                      <circle
                        cx={screenX}
                        cy={screenY}
                        r="2.5"
                        fill="#ffffff"
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      ) : (
        // Mode 1: Vector-Based Interactive Fundus Graphic
        <div className="relative w-full h-full">
          {renderFundusSVG()}

          {/* Prompt banner to click icons */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide text-gray-300 shadow-xl pointer-events-none whitespace-nowrap animate-bounce">
            💡 Click on pulse indicators to view features
          </div>
        </div>
      )}
    </div>
  );
};
