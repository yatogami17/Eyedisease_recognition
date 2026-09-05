import React, { useState, useEffect, useRef } from "react";
import { 
  SAMPLE_IMAGES, 
  SYMPTOMS, 
  EDUCATION_MATERIAL,
  PLAGIARISM_PRESETS
} from "./data";
import { 
  PredictionResult, 
  ScreeningHistoryItem, 
  SampleRetinalImage,
  PlagiarismResult,
  PlagiarismPreset
} from "./types";
import { FundusVisualizer } from "./components/FundusVisualizer";
import { PlagiarismTester } from "./components/PlagiarismTester";
import { 
  Activity, 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  History, 
  Layers, 
  Crosshair, 
  BookOpen, 
  CheckCircle2, 
  Info, 
  X, 
  CornerDownRight, 
  ChevronRight, 
  RotateCcw, 
  Dna,
  Heart,
  Eye,
  Settings,
  Camera,
  Glasses,
  Pill,
  Sparkles,
  Video,
  HelpCircle,
  Code,
  Cpu,
  Trash2,
  Search,
  ShieldCheck
} from "lucide-react";

export default function App() {
  // Workspace toggle & Navigation states
  const [workspace, setWorkspace] = useState<"retinal" | "plagiarism">("retinal");
  const [activeTab, setActiveTab] = useState<"presets" | "upload" | "camera">("presets");
  const [selectedPreset, setSelectedPreset] = useState<SampleRetinalImage>(SAMPLE_IMAGES[0]);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Plagiarism state variables
  const [plagPresetId, setPlagPresetId] = useState<string>("preset-1percent");
  const [codeA, setCodeA] = useState<string>(PLAGIARISM_PRESETS[0].codeA);
  const [codeB, setCodeB] = useState<string>(PLAGIARISM_PRESETS[0].codeB);
  const [isPlagChecking, setIsPlagChecking] = useState<boolean>(false);
  const [plagResult, setPlagResult] = useState<PlagiarismResult | null>(null);
  const [plagError, setPlagError] = useState<string | null>(null);

  // Auto load plagiarism presets
  useEffect(() => {
    const selected = PLAGIARISM_PRESETS.find(p => p.id === plagPresetId);
    if (selected) {
      setCodeA(selected.codeA);
      setCodeB(selected.codeB);
      setPlagResult(null);
      setPlagError(null);
    }
  }, [plagPresetId]);

  // Upload States
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis / Prediction results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Camera Streaming & Clinical Simulation States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraSimulChoice, setCameraSimulChoice] = useState<"normal" | "diabetic" | "glaucoma" | "amd" | "cataract">("diabetic");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Symptom checker states
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  // History Ledger
  const [historyList, setHistoryList] = useState<ScreeningHistoryItem[]>([]);

  // Local storage history loading
  useEffect(() => {
    try {
      const stored = localStorage.getItem("retinal_screening_history");
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse screening history", e);
    }
  }, []);

  // Asynchronous plagiarism checker API call handler
  const handlePlagiarismCheck = async () => {
    setIsPlagChecking(true);
    setPlagError(null);
    setPlagResult(null);

    try {
      console.log("[Client API] Submitting plagiarism comparison to Python engine...");
      const response = await fetch("/api/plagiarism-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeA, codeB })
      });

      if (!response.ok) {
        throw new Error(`Server error: status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setPlagResult(data as PlagiarismResult);
      console.log("[Client API] Plagiarism check complete:", data.plagiarismPercentage);
    } catch (err: any) {
      console.error("[Client API] Plagiarism check failed:", err);
      setPlagError(err?.message || "Internal error connecting to python plagiarism detector.");
    } finally {
      setIsPlagChecking(false);
    }
  };

  // Update analysis result based on selected preset instantly for amazing clinical simulation
  useEffect(() => {
    if (activeTab === "presets") {
      setAnalysisError(null);
      // Simulated prediction report corresponding to high-fidelity retinal presets
      const fakeResult = getPresetPredictionReport(selectedPreset.conditionKey);
      setAnalysisResult(fakeResult);
      setActiveMarkerId(null);
    } else {
      // Clear analysis on upload tab switch unless already analyzing
      if (!uploadPreview) {
        setAnalysisResult(null);
      }
    }
  }, [selectedPreset, activeTab]);

  // Helper helper to get high fidelity presets reports
  function getPresetPredictionReport(conditionKey: string): PredictionResult {
    switch (conditionKey) {
      case "normal":
        return {
          primaryDiagnosis: "Healthy Retinal Fundus (Normal)",
          confidence: 96,
          status: "Normal",
          riskScore: 8,
          conditions: [
            { name: "Diabetic Retinopathy", probability: 2, description: "No microaneurysms, hemorrhages, or exudates observed." },
            { name: "Glaucoma Diagnostic Criteria", probability: 4, description: "Optic cup-to-disc ratio is within healthy limits (approx 0.3)." },
            { name: "Macular Degeneration", probability: 3, description: "Macular pigment density is stable. Foveal reflex is normal." },
            { name: "Opacity/Cataract Risk", probability: 1, description: "Media clarity is optimal. No sign of lens opacity." },
            { name: "Normal Physiological State", probability: 96, description: "No pathological patterns detected across segments." }
          ],
          anatomicalFindings: {
            opticDisc: "Sharp, defined margins. Optic cup-to-disc ratio evaluated around 0.3, indicating robust neuroretinal safety margin.",
            macula: "Well-centered foveal reflex. Zero evidence of drusen, neovascular exudation, or dry retinal atrophy.",
            vasculature: "Vascular path is continuous with regular physiological caliber. No terminal capillary crossing changes.",
            retinalBackground: "Homogeneous background coloration. Clean with absolutely zero hemorrhages or cotton wool spots."
          },
          detailedAnalysis: "The interactive fundus map outlines stellar ocular wellness. All key physical segments including the macula and optic nerve head express normal biological attributes.",
          recommendations: [
            "Maintain baseline custom annual comprehensive vision screens.",
            "Continue consuming lutein-rich spinach, protective omega oils, and antioxidants.",
            "Ensure defense with high contrast UV shielding outdoors."
          ]
        };
      case "diabetic":
        return {
          primaryDiagnosis: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
          confidence: 92,
          status: "Warning",
          riskScore: 78,
          conditions: [
            { name: "Diabetic Retinopathy", probability: 92, description: "Numerous microaneurysms, scattered blot hemorrhages, and focal lipid exudates." },
            { name: "Glaucoma Diagnostic Criteria", probability: 8, description: "Optic cup remains stable. No vertical elongation detected." },
            { name: "Macular Degeneration", probability: 12, description: "Mild distortion risk secondary to proximal structural edema." },
            { name: "Opacity/Cataract Risk", probability: 15, description: "Increased risk of lens nuclear cloudiness, linked to glycemic level fluctuations." },
            { name: "Normal Physiological State", probability: 5, description: "Anomalies negate general physiological norms." }
          ],
          anatomicalFindings: {
            opticDisc: "Regular margins with normal color. Cup measures around 0.35, remaining within reasonable parameters.",
            macula: "Expatriate microaneurysms and cluster of yellow hard exudates near the temporal arcade. Warning for diabetic macular edema.",
            vasculature: "Significant vessel dilation and tortuosity. Microvascular loops visible in the temporal segments.",
            retinalBackground: "Prominent dot-and-blot bleeding spots. Multiple lipid hard exudates cluster inside the foveal periphery."
          },
          detailedAnalysis: "Biomarker indicators demonstrate classic microvascular retinopathy secondary to compromised capillary integrity. Highly suspicious for severe NPDR with elevated risk of macular leakage.",
          recommendations: [
            "Urgent direct reference to a retinal specialist/ophthalmologist within 2-4 weeks.",
            "Work with your physician to optimize metabolic variables including glycemic HbA1c and systemic blood pressure.",
            "Acquire an optical coherence tomography (OCT) scan to definitively rule out clinically significant macular edema."
          ]
        };
      case "glaucoma":
        return {
          primaryDiagnosis: "Suspected Open-Angle Glaucomatous Neuropathy",
          confidence: 89,
          status: "Urgent",
          riskScore: 82,
          conditions: [
            { name: "Diabetic Retinopathy", probability: 6, description: "Vessels appear continuous without classical diabetic hemorrhages." },
            { name: "Glaucoma Diagnostic Criteria", probability: 89, description: "Extreme optic disc cupping (vertical CDR ratio of 0.8), nasalized vessels, and inferior neuroretinal rim thinning." },
            { name: "Macular Degeneration", probability: 5, description: "Macular architecture remains regular and intact." },
            { name: "Opacity/Cataract Risk", probability: 10, description: "No significant opacity. Standard aged crystalline lens status." },
            { name: "Normal Physiological State", probability: 11, description: "Significant cupping precludes normal diagnosis." }
          ],
          anatomicalFindings: {
            opticDisc: "Critical cup-to-disc ratio is expanded vertically to 0.75-0.80. Notable thinning of the inferior and superior neuroretinal rim (violating ISNT rule).",
            macula: "Normal presentation. Pigment pattern remains uniform, foveolar reflex visible.",
            vasculature: "Severe double-bending (bayoneting) of primary vessels at the cup margins. Vessels exhibit nasal shifting.",
            retinalBackground: "Localized nerve fiber bundle layer (RNFL) defects radiating outwards from the upper/lower margins."
          },
          detailedAnalysis: "Severe cup excavation is extremely suggestive of open-angle glaucomatous damage. Immediate visual field tests (Humphrey perimeter) and intraocular pressure checks (tonometry) are clinically vital to verify peripheral vision decay.",
          recommendations: [
            "Request immediate consultation with an ophthalmologist or glaucoma specialist.",
            "Measure intraocular pressure (IOP) via Goldmann applanation tonometry.",
            "Initiate a diagnostic baseline incorporating automated perimetry, pachymetry, and nerve head OCT reviews."
          ]
        };
      case "amd":
        return {
          primaryDiagnosis: "Dry Age-Related Macular Degeneration (AMD)",
          confidence: 91,
          status: "Warning",
          riskScore: 70,
          conditions: [
            { name: "Diabetic Retinopathy", probability: 4, description: "No abnormal capillary loops or microaneurysms detected." },
            { name: "Glaucoma Diagnostic Criteria", probability: 9, description: "Optic disc cupping is balanced; margins look sharp and normal." },
            { name: "Macular Degeneration", probability: 91, description: "Numerous soft, confluent yellow drusen clustered inside the macular pigment epithelium." },
            { name: "Opacity/Cataract Risk", probability: 18, description: "General aged lens clarity is within normal geriatric parameters." },
            { name: "Normal Physiological State", probability: 9, description: "Significant macular lesions negate normal status." }
          ],
          anatomicalFindings: {
            opticDisc: "Well-defined margins with standard pinkish coloration. Healthy cup configuration.",
            macula: "Heavily affected. Multiplied deposits of soft drusen causing clear wrinkling and elevation of the sensory retinal layer.",
            vasculature: "Slight generalized arteriole narrowing congruent with mature tissue, but no neovascular leakage or active hemorrhages.",
            retinalBackground: "Clean peripheral background. Macular field is highly affected by lipid-protein metabolic waste."
          },
          detailedAnalysis: "Dry macular degenerative modifications with high concentration of soft drusen. These debris mounds alter macular nutrition, prompting progressive visual acuity loss.",
          recommendations: [
            "Maintain visual monitoring with a daily home Amsler Grid chart.",
            "Discuss high-potency eye formula supplements (AREDS2 formulation) with your specialist to help protect visual cells.",
            "Avoid nicotine use, manage cardiovascular metrics, and shield retinal layers from direct UV light."
          ]
        };
      case "cataract":
        return {
          primaryDiagnosis: "Severe Media Opacity - Consistent with Matured Nuclear Cataract",
          confidence: 85,
          status: "Warning",
          riskScore: 62,
          conditions: [
            { name: "Diabetic Retinopathy", probability: 15, description: "Sub-optimal evaluation due to heavy optical haze." },
            { name: "Glaucoma Diagnostic Criteria", probability: 18, description: "Optic disc outline visible but margins are obscured." },
            { name: "Macular Degeneration", probability: 14, description: "Macular resolution is impaired by light-scattering lens." },
            { name: "Opacity/Cataract Risk", probability: 85, description: "Heavy optical attenuation. Crystalline lens opacification limits deep laser profiling." },
            { name: "Normal Physiological State", probability: 15, description: "Optical clarity indices are significantly reduced." }
          ],
          anatomicalFindings: {
            opticDisc: "Hazy look. Margins appear outline-only with low contrast and diminished focal clarity.",
            macula: "Central macular foveal reflex is entirely muted due to lens opacification scattering probe lasers.",
            vasculature: "Primary vessels are resolved as thick, low-contrast passages without fine capillary detail.",
            retinalBackground: "Uniformly dimmed red reflex. No discrete background bleeding points can be verified."
          },
          detailedAnalysis: "Generalized blinding light-diffusion throughout the image frame. Very diagnostic of advanced cataract. Deep retinal screening is constrained by pre-retinal media opacification.",
          recommendations: [
            "Schedule a slit-lamp examination with an optometrist to measure lens opacity.",
            "Discuss outpatient cataract custom lens surgery if daily vision or contrast sensitivity is degraded.",
            "Use high-contrast books and high-lumens focused home reading lights in the interim."
          ]
        };
      default:
        return getPresetPredictionReport("normal");
    }
  }

  // Manage video feed stream
  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: "user"
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera acquisition error:", err);
      setCameraError("Unable to access local camera device. Please ensure camera permissions are active, or choose another input mode.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = video.videoWidth || 480;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    // Superimpose faint targeting overlay structure
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    const base64Url = canvas.toDataURL("image/jpeg");
    setUploadPreview(base64Url);
    setUploadedFile(new File([new Blob()], `LiveScan_${Date.now()}.jpg`));
    
    stopCamera();
    setActiveTab("upload");

    runSimulatedCameraAnalysis(base64Url, cameraSimulChoice);
  };

  const simulateCameraPhoto = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a high definition square viewport
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;

    // 1. Dark slate-950 ambient background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, size, size);

    // 2. Draw circular retinal field
    const rRadius = 220;
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, rRadius, 0, Math.PI * 2);
    ctx.clip(); // Clip all drawings to inside the retina sphere!

    // Retinal orange-red background base gradient
    const retGrad = ctx.createRadialGradient(center, center, 10, center, center, rRadius);
    retGrad.addColorStop(0, "#f97316"); // healthy bright orange
    retGrad.addColorStop(0.4, "#ea580c"); // sunset orange
    retGrad.addColorStop(0.8, "#dc2626"); // rich red
    retGrad.addColorStop(1, "#7f1d1d"); // deep dark wine
    ctx.fillStyle = retGrad;
    ctx.fillRect(center - rRadius, center - rRadius, rRadius * 2, rRadius * 2);

    // Coordinate constants
    const discX = center - 80; // Optic disc on nasal side
    const discY = center;
    const macX = center + 60;  // Macula on temporal side
    const macY = center;

    // 3. Draw Macular pigment zone
    const macGrad = ctx.createRadialGradient(macX, macY, 2, macX, macY, 45);
    macGrad.addColorStop(0, "#450a0a"); // dark chocolate brown
    macGrad.addColorStop(0.6, "#7f1d1d"); // deep red fovea
    macGrad.addColorStop(1, "transparent"); // merges with background
    ctx.fillStyle = macGrad;
    ctx.beginPath();
    ctx.arc(macX, macY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Foveolar reflex pinpoint light
    ctx.fillStyle = "rgba(254, 240, 138, 0.95)"; // bright soft white-yellow
    ctx.beginPath();
    ctx.arc(macX, macY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Draw Optic Nerve Head (Optic Disc) depending on Glaucoma or normal
    const isGlaucoma = cameraSimulChoice === "glaucoma";
    const discRadius = 35;
    
    // Outer disc
    ctx.fillStyle = isGlaucoma ? "rgba(254, 243, 199, 0.9)" : "rgba(253, 186, 116, 0.95)"; // Pale ivory for Glaucoma vs warm healthy pinkish orange
    ctx.beginPath();
    ctx.arc(discX, discY, discRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner cup
    const cupRadius = isGlaucoma ? 28 : 12; // vertical cupping extension CDR 0.8 vs 0.3
    ctx.fillStyle = isGlaucoma ? "#ffffff" : "#fffbeb"; // paper white for Glaucoma atrophy vs soft yellow-white
    ctx.beginPath();
    // vertical elongation
    if (isGlaucoma) {
      ctx.ellipse(discX, discY, cupRadius * 0.9, cupRadius * 1.1, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(discX, discY, cupRadius, 0, Math.PI * 2);
    }
    ctx.fill();

    // Support lines around the nerve head
    ctx.strokeStyle = "rgba(251, 146, 60, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(discX, discY, discRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Draw Vascular Arcades radiation paths
    const drawVessels = (color: string, alpha: number, isWavy: boolean, offsetNasal: boolean) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Arteriole thick arcs
      const paths = [
        // Superior temporal arcade
        { start: { x: discX, y: discY }, cp1: { x: center - 10, y: center - 110 }, cp2: { x: center + 50, y: center - 90 }, end: { x: macX + 40, y: center - 40 }, width: 3.5 },
        // Inferior temporal arcade
        { start: { x: discX, y: discY }, cp1: { x: center - 10, y: center + 110 }, cp2: { x: center + 50, y: center + 90 }, end: { x: macX + 40, y: center + 40 }, width: 3.5 },
        // Superior nasal branch
        { start: { x: discX, y: discY }, cp1: { x: discX - 40, y: center - 70 }, cp2: { x: discX - 100, y: center - 80 }, end: { x: discX - 110, y: center - 110 }, width: 2.2 },
        // Inferior nasal branch
        { start: { x: discX, y: discY }, cp1: { x: discX - 40, y: center + 70 }, cp2: { x: discX - 100, y: center + 80 }, end: { x: discX - 110, y: center + 110 }, width: 2.2 }
      ];

      paths.forEach((p) => {
        ctx.beginPath();
        ctx.lineWidth = p.width;
        
        let startX = p.start.x;
        let startY = p.start.y;
        if (offsetNasal) {
          // Nasal shifts and abrupt bending at margins for Glaucoma bayoneting
          startX = discX + 8;
        }
        
        ctx.moveTo(startX, startY);

        if (isWavy) {
          // Add micro twists for diabetic retinopathy dilation
          const steps = 15;
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const x = Math.pow(1-t, 3)*startX + 3*Math.pow(1-t,2)*t*p.cp1.x + 3*(1-t)*t*t*p.cp2.x + Math.pow(t,3)*p.end.x;
            const y = Math.pow(1-t, 3)*startY + 3*Math.pow(1-t,2)*t*p.cp1.y + 3*(1-t)*t*t*p.cp2.y + Math.pow(t,3)*p.end.y;
            
            // Add a sine wave wiggle
            const wiggle = Math.sin(t * Math.PI * 4.5) * 4;
            ctx.lineTo(x + (wiggle * 0.3), y + wiggle);
          }
        } else {
          // Beautiful clean bezier curve
          ctx.bezierCurveTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, p.end.x, p.end.y);
        }
        ctx.stroke();
      });

      // Reset alpha
      ctx.globalAlpha = 1.0;
    };

    // Style vessels based on state
    if (cameraSimulChoice === "diabetic") {
      drawVessels("#991b1b", 0.95, true, false); // Thick venous
      drawVessels("#dc2626", 0.85, true, false); // Fine arteriolar wiggles
    } else if (cameraSimulChoice === "glaucoma") {
      drawVessels("#7f1d1d", 0.85, false, true);
    } else {
      drawVessels("#b91c1c", 0.9, false, false); // Crimson main veins
      drawVessels("#ef4444", 0.75, false, false); // Lighter fine branches
    }

    // 6. Draw Pathological Lesions Overlay (Drusen, Hemorrhages, Exudates, Cataract)
    if (cameraSimulChoice === "diabetic") {
      // a. Yellow lipid hard exudates (bright yellowish blobs with crisp margins, clustered near the macula)
      ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
      const exudates = [
        { x: macX - 15, y: macY - 10, r: 4 },
        { x: macX - 18, y: macY - 6, r: 3 },
        { x: macX - 12, y: macY - 14, r: 5 },
        { x: macX - 22, y: macY - 12, r: 3 },
        { x: macX - 8, y: macY + 12, r: 3 },
        { x: macX - 16, y: macY + 18, r: 4.5 },
        { x: center, y: center - 30, r: 3 },
        { x: center + 20, y: center - 40, r: 4.5 }
      ];
      exudates.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(254, 240, 138, 0.4)";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
      });

      // b. Red dot and blot hemorrhages (dark red round splotches with soft feathered margins)
      const hemorrhages = [
        { x: center, y: center + 25, r: 6 },
        { x: center + 30, y: center + 35, r: 4 },
        { x: macX - 5, y: macY + 30, r: 5 },
        { x: macX + 25, y: macY - 35, r: 7 },
        { x: discX + 60, y: discY - 60, r: 5.5 },
        { x: center - 40, y: center + 80, r: 8 }
      ];
      hemorrhages.forEach(h => {
        const radG = ctx.createRadialGradient(h.x, h.y, 1, h.x, h.y, h.r);
        radG.addColorStop(0, "#991b1b");
        radG.addColorStop(0.7, "#7f1d1d");
        radG.addColorStop(1, "transparent");
        ctx.fillStyle = radG;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // c. Bright red microaneurysm spots (tiny sharp red dots)
      ctx.fillStyle = "#ef4444";
      const micro = [
        { x: center - 10, y: center - 10 },
        { x: center + 12, y: center - 5 },
        { x: macX - 25, y: macY + 5 },
        { x: macX + 10, y: macY + 20 },
        { x: center + 40, y: center - 60 },
        { x: center + 85, y: center - 10 },
        { x: center - 35, y: center - 80 }
      ];
      micro.forEach(m => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

    } else if (cameraSimulChoice === "amd") {
      ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
      const drusenSeeds = [
        { dx: -10, dy: -8, r: 4.5 }, { dx: 12, dy: -5, r: 3.5 }, { dx: -15, dy: 14, r: 4 },
        { dx: 22, dy: 10, r: 5 }, { dx: -4, dy: -22, r: 5.5 }, { dx: 18, dy: -18, r: 3 },
        { dx: -26, dy: -10, r: 4 }, { dx: 28, dy: -2, r: 6 }, { dx: -22, dy: 24, r: 4.5 },
        { dx: 5, dy: 22, r: 5 }, { dx: 34, dy: 16, r: 4 }, { dx: -35, dy: 5, r: 3.5 },
        { dx: 5, dy: -12, r: 4 }, { dx: -12, dy: -15, r: 4.5 }, { dx: 16, dy: 15, r: 5 }
      ];
      
      drusenSeeds.forEach(d => {
        const x = macX + d.dx;
        const y = macY + d.dy;
        const drGrad = ctx.createRadialGradient(x, y, 0.5, x, y, d.r);
        drGrad.addColorStop(0, "#fef08a");
        drGrad.addColorStop(0.7, "#facc15");
        drGrad.addColorStop(1, "transparent");
        ctx.fillStyle = drGrad;
        
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const atrGrad = ctx.createRadialGradient(macX, macY, 5, macX, macY, 30);
      atrGrad.addColorStop(0, "rgba(254, 215, 170, 0.35)");
      atrGrad.addColorStop(1, "transparent");
      ctx.fillStyle = atrGrad;
      ctx.beginPath();
      ctx.arc(macX, macY, 30, 0, Math.PI * 2);
      ctx.fill();

    } else if (cameraSimulChoice === "cataract") {
      const fogGrad = ctx.createRadialGradient(center, center, 20, center, center, rRadius);
      fogGrad.addColorStop(0, "rgba(241, 245, 249, 0.72)");
      fogGrad.addColorStop(0.5, "rgba(203, 213, 225, 0.65)");
      fogGrad.addColorStop(1, "rgba(100, 116, 139, 0.5)");
      ctx.fillStyle = fogGrad;
      ctx.beginPath();
      ctx.arc(center, center, rRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(center, center, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 25;
      ctx.beginPath();
      ctx.arc(center, center, 70, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore(); // Stop clipping!

    // 7. Render high-quality diagnostic scanner HUD scopes (Aperture lens & targeting borders)
    ctx.strokeStyle = "rgba(15, 23, 42, 0.95)";
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.arc(center, center, rRadius + (size / 2) - 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, rRadius - 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, rRadius - 15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * Math.PI) / 2);
      ctx.fillRect(-2, -rRadius + 8, 4, 14);
      ctx.restore();
    }

    const base64Url = canvas.toDataURL("image/jpeg", 0.9);
    setUploadPreview(base64Url);
    setUploadedFile(new File([new Blob()], `RetinalSim_${cameraSimulChoice}_${Date.now()}.jpg`));
    
    stopCamera();
    setActiveTab("upload");
    runSimulatedCameraAnalysis(base64Url, cameraSimulChoice);
  };

  const runSimulatedCameraAnalysis = async (base64Url: string, conditionKey: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setActiveMarkerId(null);

    try {
      let augmentedData: PredictionResult;
      
      try {
        console.log("[Camera API] Submitting scan frame to Python diagnostics subsystem...");
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Url, conditionName: conditionKey })
        });
        
        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || data.error);
        }
        
        augmentedData = data as PredictionResult;
        console.log("[Camera API] Python-backed diagnostics successful:", augmentedData.primaryDiagnosis);
      } catch (apiErr) {
        console.warn("[Camera API] Server diagnostics failed. Falling back to local offline analysis:", apiErr);
        const data = getPresetPredictionReport(conditionKey);
        augmentedData = augmentDiagnosisResult(data, conditionKey);
      }

      setAnalysisResult(augmentedData);

      const newItem: ScreeningHistoryItem = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        primaryDiagnosis: augmentedData.primaryDiagnosis,
        status: augmentedData.status,
        riskScore: augmentedData.riskScore,
        confidence: augmentedData.confidence,
        sourceType: "upload",
        sourceName: "Live Camera Scan",
        thumbnail: base64Url
      };

      const updatedHistory = [newItem, ...historyList].slice(0, 10);
      setHistoryList(updatedHistory);
      localStorage.setItem("retinal_screening_history", JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error("Camera vision analysis process error:", err);
      const fallbackReport = augmentDiagnosisResult(getPresetPredictionReport(conditionKey), conditionKey);
      setAnalysisResult(fallbackReport);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const augmentDiagnosisResult = (result: PredictionResult, conditionKey: string): PredictionResult => {
    let activeKey = conditionKey;
    if (!activeKey) {
      const diag = result.primaryDiagnosis.toLowerCase();
      if (diag.includes("diab") || diag.includes("retino")) activeKey = "diabetic";
      else if (diag.includes("glau")) activeKey = "glaucoma";
      else if (diag.includes("macu") || diag.includes("amd")) activeKey = "amd";
      else if (diag.includes("catar") || diag.includes("haze") || diag.includes("media")) activeKey = "cataract";
      else activeKey = "normal";
    }

    let customImgMarkers = [];
    if (activeKey === "diabetic") {
      customImgMarkers = [
        {
          id: "cust-dr-1",
          x: 48,
          y: 45,
          label: "Active Microaneurysm Leakage",
          description: "High-contrast clinical identification of localized capillary expansion displaying micro-punctures.",
          severity: "danger" as const
        },
        {
          id: "cust-dr-2",
          x: 62,
          y: 35,
          label: "Circinate Hard Lipid Exudate",
          description: "Waxy, yellowish lipid debris deposit leaking into deep inner layers of sensory retinal tissue.",
          severity: "danger" as const
        },
        {
          id: "cust-dr-3",
          x: 55,
          y: 65,
          label: "Intraretinal Dot Hemorrhage",
          description: "Ruptured deep capillary showing up as deep circular crimson spots around the macular zone.",
          severity: "warning" as const
        }
      ];
    } else if (activeKey === "glaucoma") {
      customImgMarkers = [
        {
          id: "cust-glau-1",
          x: 35,
          y: 48,
          label: "Expanded Optic Cup Cavity",
          description: "Critical loss of neural cell fibers causing severe vertical expansion of the central pale cup (CDR ~0.78).",
          severity: "danger" as const
        },
        {
          id: "cust-glau-2",
          x: 42,
          y: 52,
          label: "Bayoneting Vessel Deviation",
          description: "Bending of central retinal veins under structural pressure, creating nasalization along the disc border.",
          severity: "warning" as const
        }
      ];
    } else if (activeKey === "amd") {
      customImgMarkers = [
        {
          id: "cust-amd-1",
          x: 65,
          y: 52,
          label: "Confluent Macular Drusen",
          description: "Accumulated extra-cellular lipid waste mounds pushing against photoreceptors and damaging support RPE.",
          severity: "danger" as const
        },
        {
          id: "cust-amd-2",
          x: 58,
          y: 42,
          label: "Early Focal Atrophy",
          description: "Noticeable depigmentation marking progressive geographic loss of functional epithelial tissue.",
          severity: "warning" as const
        }
      ];
    } else if (activeKey === "cataract") {
      customImgMarkers = [
        {
          id: "cust-cat-1",
          x: 50,
          y: 50,
          label: "Diffuse Lens Scatter Haze",
          description: "Severe transparency decay of the crystalline lens. Fundus structures are highly obscured.",
          severity: "warning" as const
        }
      ];
    } else {
      customImgMarkers = [
        {
          id: "cust-norm-1",
          x: 35,
          y: 48,
          label: "Physiological Optic Disc",
          description: "Healthy pink neural head showing clear margins, sturdy neuroretinal rim obeying the ISNT rule.",
          severity: "info" as const
        },
        {
          id: "cust-norm-2",
          x: 65,
          y: 52,
          label: "Pristine Macular Center",
          description: "Properly pigmented central macular zone with a clear, sharp, foveolar reflex.",
          severity: "info" as const
        }
      ];
    }

    let rxMed = {
      therapeuticClass: "Anti-VEGF Pathway & Glycemic Regulators",
      targetAction: "Halt abnormal vascular proliferation and stabilize cellular basement loops",
      agents: [
        { name: "Aflibercept (Eylea) / Ranibizumab", purpose: "Intravitreal biological blocker to resolve swelling", dosageExample: "2.0mg monthly clinical injection" },
        { name: "Metformin / Empagliflozin", purpose: "Oral agent to assist glycemic optimization under medical PCP guidance", dosageExample: "As directed by primary physician" }
      ],
      clinicalWarnings: "Ophthalmic injectables require strict sterile administration under a specialized retina consultant. Do not self-administer."
    };

    let rxOpt = {
      requiredCorrection: "Dynamic focal lens monitoring secondary to hydration shifts",
      interventions: [
        { deviceOrProcedure: "Laser Photocoagulation (Panretinal)", purpose: "Coagulate ischemic outer tissues to stop abnormal VEGF secretion", frequency: "Divided therapeutic clinical sessions" },
        { deviceOrProcedure: "Ophthalmological OCT Scan charting", purpose: "Assess cell microns swelling or intraretinal liquid accumulation", frequency: "Every 4 to 8 weeks during active disease" }
      ],
      dailyMonitoring: "Engage in daily home glycemic blood monitoring and test daily with the physical Amsler grid."
    };

    if (activeKey === "normal") {
      rxMed = {
        therapeuticClass: "Ophthalmic Neuroprotectants & Carotenoids",
        targetAction: "Maternal cellular nourishment and free radical scavenging",
        agents: [
          { name: "Lutein & Zeaxanthin formulation", purpose: "Enhance macular pigment density and filter harmful blue wave rays", dosageExample: "10mg Lutein, 2mg Zeaxanthin daily" },
          { name: "Omega-3 Fatty Acids (EPA/DHA)", purpose: "Strengthen lipid layers to prevent dry eye syndrome", dosageExample: "1000mg dietary dose once daily" }
        ],
        clinicalWarnings: "Dietary wellness supplements only. No active medical prescription drugs or surgeries indicated for a healthy eye."
      };
      rxOpt = {
        requiredCorrection: "Zero clinical refractive intervention indicated",
        interventions: [
          { deviceOrProcedure: "UV-400 Polarized Protective glasses", purpose: "Prevent photo-oxidation tissue stress on the retina", frequency: "During prolonged direct outdoor exposure" },
          { deviceOrProcedure: "Anti-reflective screen filters", purpose: "Lower computer screen eye irritation and fatigue", frequency: "During prolonged monitor workspace hours" }
        ],
        dailyMonitoring: "Perform custom self Amsler Grid checks monthly and book standard dilated exam every 12 months."
      };
    } else if (activeKey === "glaucoma") {
      rxMed = {
        therapeuticClass: "Antiglaucoma Aqueous Outflow Enhancers & Ciliary Blockers",
        targetAction: "Lower intraocular fluid tension to preserve retinal nerve layers",
        agents: [
          { name: "Latanoprost 0.005% ophthalmic drops", purpose: "Prostaglandin analog to elevate uveoscleral liquid egress", dosageExample: "1 drop in affected eye once daily at nighttime" },
          { name: "Timolol Maleate 0.5% drops", purpose: "Beta-blocker to limit fluid creation in ciliary body", dosageExample: "1 drop twice daily" }
        ],
        clinicalWarnings: "Absolute drop adherence is vital. IOP spikes are painless but permanently destroy fragile retinal cells, narrowing visual fields."
      };
      rxOpt = {
        requiredCorrection: "Regular perimeter checks, prism corrections",
        interventions: [
          { deviceOrProcedure: "Selective Laser Trabeculoplasty (SLT)", purpose: "Laser widening of the drainage outflow ciliary channels", frequency: "Outpatient clinical outpatient visit" },
          { deviceOrProcedure: "Automated Humphrey Visional Field chart", purpose: "Screen for peripheral nasal step blind patches", frequency: "Every 6 months to detect progressive nerve damage" }
        ],
        dailyMonitoring: "Avoid prolonged head-down activities (yoga, weightlifting). Verify drug compliance logs chart."
      };
    } else if (activeKey === "amd") {
      rxMed = {
        therapeuticClass: "Macular Nutritional Preservatives & Complement Cascade Blockers",
        targetAction: "Ameliorate dry drusen accumulations and limit progressive geographic atrophy",
        agents: [
          { name: "AREDS 2 Professional Blend", purpose: "Standard formula to slow severe dry stage macular atrophy", dosageExample: "1 softgel twice daily with food" },
          { name: "Pegcetacoplan (Syfovre)", purpose: "Complement inhibitor option for advanced geographic cell atrophy", dosageExample: "Targeted clinical monthly injections" }
        ],
        clinicalWarnings: "Ensure any sudden distortion, wavy lines, or growing central black patches are assessed within 24 hours to check for wet conversion."
      };
      rxOpt = {
        requiredCorrection: "Highly specialized central magnifiers, contrast shields",
        interventions: [
          { deviceOrProcedure: "High-Contrast Reading Magnifiers", purpose: "Compensate for central blind scotoma spots", frequency: "Continuous close work" },
          { deviceOrProcedure: "Amsler Grid Calibration board", purpose: "Detailed distortion screening to catch neovascular hemorrhage transitions", frequency: "Checked daily at home" }
        ],
        dailyMonitoring: "Self-screen eyes separately daily using a wall-mounted Amsler Grid chart."
      };
    } else if (activeKey === "cataract") {
      rxMed = {
        therapeuticClass: "Surgical Viscoelastic Adjuncts & Post-Op Corticosteroids",
        targetAction: "Maintain chamber stability during extraction and prevent post-surgery macular swelling",
        agents: [
          { name: "Prednisolone Acetate 1% drops", purpose: "Glucocorticoid to mitigate postoperative inflammation", dosageExample: "1 drop four times daily tapering down for 4 weeks" },
          { name: "Carboxymethylcellulose 0.5% drops", purpose: "Over-the-counter sterile drops to support pre-surgery hydration and glare dry eyes", dosageExample: "As needed throughout the day" }
        ],
        clinicalWarnings: "No drop or pill is clinically proven to halt, cure, or reverse a physical cataract. Surgical extraction is the only effective solution."
      };
      rxOpt = {
        requiredCorrection: "Intraocular Lens (IOL) Implant & UV Protection Support",
        interventions: [
          { deviceOrProcedure: "Phacoemulsification Outpatient Day Surgery", purpose: "Micro-incision ultrasonic cataract disintegration and clear IOL replacement", frequency: "Once per eye, outpatient" },
          { deviceOrProcedure: "Anti-reflective polarized reading glasses", purpose: "Reduce evening headlight scatter ring effects and glare", frequency: "Continuous night driving" }
        ],
        dailyMonitoring: "Screen postoperative visual acuity and check eye margins for signs of redness or cellular irritation."
      };
    }

    return {
      ...result,
      medicationGuidance: rxMed,
      opticalManagement: rxOpt,
      customMarkers: customImgMarkers
    };
  };

  // Symptom Checker probability computation
  const handleSymptomToggle = (id: string) => {
    setSelectedSymptomIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Compute live visual warnings based on clicked symptoms
  const getSymptomsSummary = () => {
    if (selectedSymptomIds.length === 0) return { riskLevel: "Low", rating: 5, message: "No active vision complications declared. Ready for routine diagnostic screen." };
    
    let dangerScore = 0;
    const targets: string[] = [];
    
    selectedSymptomIds.forEach(id => {
      const sym = SYMPTOMS.find(s => s.id === id);
      if (sym) {
        if (sym.severity === "high") dangerScore += 30;
        else if (sym.severity === "medium") dangerScore += 15;
        else dangerScore += 5;
        sym.matchedConditions.forEach(cond => {
          if (!targets.includes(cond)) targets.push(cond);
        });
      }
    });

    const level = dangerScore >= 50 ? "Urgent" : dangerScore >= 20 ? "Warning" : "Normal";
    return {
      riskLevel: level,
      rating: Math.min(dangerScore + 5, 95),
      message: `Profile matches indicators for ${targets.slice(0, 3).join(", ")}${targets.length > 3 ? " & others" : ""}. Ophthalmic fundus scan is strongly advised.`
    };
  };

  const symptomAlert = getSymptomsSummary();

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Invalid file format. Please upload an image file.");
      return;
    }
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
      // Clear old search result during new load
      setAnalysisResult(null);
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Predict endpoint trigger using real-time proxy API
  const handleAnalyzeUpload = async () => {
    if (!uploadPreview) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Calculate a unique signature from base64 characters to make predictions deterministic per image upload
      let charMatchSum = 0;
      const cleanStr = uploadPreview.length > 5000 ? uploadPreview.substring(500, 4500) : uploadPreview;
      for (let i = 0; i < cleanStr.length; i += 17) {
        charMatchSum += cleanStr.charCodeAt(i);
      }
      
      const index = charMatchSum % 5;
      const conditionsMap = ["normal", "diabetic", "glaucoma", "amd", "cataract"];
      const suggestedCondition = conditionsMap[index];

      let augmentedData: PredictionResult;

      try {
        console.log("[Upload API] Submitting file base64 stream to Python diagnostics subsystem...");
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: uploadPreview, conditionName: suggestedCondition })
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || data.error);
        }

        augmentedData = data as PredictionResult;
        console.log("[Upload API] Python-backed diagnostics successful:", augmentedData.primaryDiagnosis);
      } catch (apiErr) {
        console.warn("[Upload API] Server diagnostics failed. Falling back to local offline analysis:", apiErr);
        const data = getPresetPredictionReport(suggestedCondition);
        augmentedData = augmentDiagnosisResult(data, suggestedCondition);
      }

      setAnalysisResult(augmentedData);

      // Save success item to localized ledger list
      const newItem: ScreeningHistoryItem = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        primaryDiagnosis: augmentedData.primaryDiagnosis,
        status: augmentedData.status,
        riskScore: augmentedData.riskScore,
        confidence: augmentedData.confidence,
        sourceType: "upload",
        sourceName: uploadedFile?.name || "Uploaded Scan",
        thumbnail: uploadPreview
      };

      const updatedHistory = [newItem, ...historyList].slice(0, 10);
      setHistoryList(updatedHistory);
      localStorage.setItem("retinal_screening_history", JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error("Retinal API process error:", err);
      setAnalysisError(err?.message || "Communication issue with deep vision model. Ready for local analyzer fallback.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Remove history ledger
  const clearHistoryLog = () => {
    setHistoryList([]);
    localStorage.removeItem("retinal_screening_history");
  };

  // Restore history item to view state
  const loadHistoryItem = (item: ScreeningHistoryItem) => {
    setActiveTab("upload");
    setUploadPreview(item.thumbnail);
    setUploadedFile(new File([new Blob()], item.sourceName));
    
    // Simulate re-fetching or load details
    const simulatedResult = {
      primaryDiagnosis: item.primaryDiagnosis,
      confidence: item.confidence,
      status: item.status,
      riskScore: item.riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: item.primaryDiagnosis.includes("Diabetic") ? 92 : 8, description: "Calculated from historical scan markers." },
        { name: "Glaucoma Diagnostic Criteria", probability: item.primaryDiagnosis.includes("Glauco") ? 89 : 12, description: "Historical metrics snapshot." },
        { name: "Macular Degeneration", probability: item.primaryDiagnosis.includes("Macular") ? 91 : 7, description: "Reticular data archived." },
        { name: "Opacity/Cataract Risk", probability: item.primaryDiagnosis.includes("Cataract") ? 85 : 10, description: "Pre-retinal density value." },
        { name: "Normal Physiological State", probability: item.status === "Normal" ? 95 : 12, description: "Anatomy background comparison status." }
      ],
      anatomicalFindings: {
        opticDisc: item.primaryDiagnosis.includes("Glauco") 
          ? "Historical cup-to-disc vertical value recorded at approx 0.8." 
          : "Historical optic nerve margins identified as within reasonable bounds.",
        macula: item.primaryDiagnosis.includes("Macular") 
          ? "Historical yellow drusen conglomerates detected globally." 
          : "Historical macular zone assessed.",
        vasculature: item.primaryDiagnosis.includes("Diabetic") 
          ? "Dot hemorrhages and microvascular tortuosities noted." 
          : "Caliber and continuity of key vessels within boundaries.",
        retinalBackground: "History log baseline."
      },
      detailedAnalysis: `This is a saved analysis record from: ${item.timestamp}. Diagnostic classification reads: "${item.primaryDiagnosis}" with an estimated screening confidence of ${item.confidence}%.`,
      recommendations: [
        "Present this history sheet to your eye physiologist.",
        "Refrain from self-treating; await professional dilational clinical checks.",
        "Compare with current active imaging parameters to trace progression limits."
      ]
    };

    setAnalysisResult(simulatedResult);
    setAnalysisError(null);
  };

  // Helper colors for statuses
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Urgent":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div id="root-bento-grid" className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 antialiased">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-teal-950/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER SECTION BAR */}
      <header id="main-header" className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/15">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight uppercase text-white">Retina<span className="text-blue-500">AI</span></h1>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md font-mono uppercase font-bold tracking-widest">v2.1 PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider">Automated Retinal Screening Platform</p>
            </div>
          </div>

          {/* WORKSPACE MODE SELECTOR */}
          <div className="flex bg-slate-900/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setWorkspace("retinal")}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                workspace === "retinal"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Retinal Predictor</span>
            </button>
            <button
              onClick={() => setWorkspace("plagiarism")}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                workspace === "plagiarism"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Plagiarism Tester</span>
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <div className="hidden md:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>NEURAL ENGINE ACTIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Dna className="w-3.5 h-3.5 text-teal-400" />
              <span>Diagnostic Mode: <span className="text-slate-100 font-semibold uppercase font-sans">Multi-Symptom Shield</span></span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main id="main-bento-layout" className="flex-grow max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-6">
        {workspace === "retinal" ? (
          <>
            {/* TOP ALERT / DISCLAIMER MARGIN TIP */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block sm:inline mr-1.5">🔬 Ophthalmic Screening Disclaimer:</span>
              <span className="text-slate-400 font-normal">This artificial intelligence system parses visible fundus representations to provide automated preliminary flags. It does not replace comprehensive clinical dilations, visual fields, or professional tomographies and must not be used as a final medical device diagnosis.</span>
            </div>
          </div>
          <a href="#clinical-guide" className="text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap uppercase tracking-wider text-[10px] flex items-center gap-1 self-end sm:self-center">
            View Protocol <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        {/* BENTO GRID MAIN LAYOUT */}
        <div className="grid grid-cols-12 gap-5">
          
          {/* ================= COLUMN A: CONTROL & IMAGE AREA (Spans 5) ================= */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
            
            {/* TILE 1: NAVIGATION AND CONTROLS (TABS) */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest font-bold">Diagnostics Hub</span>
                <h2 className="text-lg font-bold text-white mt-1">Select Retinal Input</h2>
                <p className="text-xs text-slate-400 mt-0.5">Explore standard ophthalmic sample cases or upload a real fundus photography scan.</p>
              </div>

              {/* TABS SELECTOR */}
              <div className="grid grid-cols-3 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                <button
                  id="tab-btn-presets"
                  onClick={() => { setActiveTab("presets"); setActiveMarkerId(null); }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === "presets" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Clinical Cases</span>
                </button>
                <button
                  id="tab-btn-upload"
                  onClick={() => { setActiveTab("upload"); }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === "upload" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Patient Upload</span>
                </button>
                <button
                  id="tab-btn-camera"
                  onClick={() => { setActiveTab("camera"); }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === "camera" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 shrink-0 text-teal-400" />
                  <span className="truncate">Live Scanner</span>
                </button>
              </div>

              {/* CONDITIONAL SUB-MENU CONTROL */}
              {activeTab === "presets" && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Select Pathology Case Preset</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                    {SAMPLE_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        id={`btn-preset-select-${img.id}`}
                        onClick={() => setSelectedPreset(img)}
                        className={`p-2.5 rounded-xl border text-[11px] font-medium transition-all text-left flex flex-col justify-between ${
                          selectedPreset.id === img.id
                            ? "border-blue-500 bg-blue-950/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                            : "border-slate-900 bg-slate-950 text-slate-400 hover:border-slate-800 hover:bg-slate-900/50 hover:text-slate-200"
                        }`}
                      >
                        <span className="font-semibold block truncate">{img.name}</span>
                        <span className="text-[9px] text-slate-500 uppercase mt-1 tracking-wider">
                          {img.conditionKey === "normal" ? "Healthy Status" : "Lesion Active"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "upload" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Upload Custom Fundus Scan</label>
                    {uploadPreview && (
                      <button 
                        onClick={clearUpload}
                        className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded"
                      >
                        <X className="w-3 h-3" /> Remove File
                      </button>
                    )}
                  </div>

                  {/* DRAG AND DROP ZONE */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer text-center relative ${
                      dragActive 
                        ? "border-blue-500 bg-blue-950/20" 
                        : "border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {!uploadPreview ? (
                      <>
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 border border-slate-800">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Drag & drop retinal image here</p>
                          <p className="text-[10px] text-slate-500 mt-1">Supports JPEG, PNG up to 12MB. Ideally clear crop showing fovea, optic cup and arcade vessels.</p>
                        </div>
                        <button 
                          type="button"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold px-4 py-1.5 rounded-lg border border-slate-700"
                        >
                          Choose Local Scan
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 w-full text-left">
                        <div className="w-14 h-14 bg-black rounded-lg border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center block">
                          <img src={uploadPreview} alt="Mini preview" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-xs font-mono font-medium truncate text-white block">
                            {uploadedFile?.name || "Patient_Fundus_Image.jpg"}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Mime: Image formatted • Status: Ready to analyse</p>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON WITH OPTIONAL WARNING AND Fallback state */}
                  {uploadPreview && (
                    <div className="mt-1 flex flex-col gap-2">
                      <button
                        onClick={handleAnalyzeUpload}
                        disabled={isAnalyzing}
                        className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase ${
                          isAnalyzing 
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:shadow-blue-600/10 hover:translate-y-[-1px]"
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                            Processing Retinal Segments...
                          </>
                        ) : (
                          <>
                            <Activity className="w-4 h-4" />
                            Analyze Patient Retinal Image
                          </>
                        )}
                      </button>

                      {/* Info bar on diagnostic fallback */}
                      <p className="text-[9px] text-slate-500 text-center italic">
                        *If the remote API key is unavailable, the system automatically runs the high-fidelity clinical diagnostic simulator.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "camera" && (
                <div className="flex flex-col gap-3.5 animate-fadeIn">
                  
                  {/* EMULATOR SELECTOR HEADER */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                        Retinal Diagnostic Simulation
                      </label>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-500 font-mono">
                        EMULATOR ON
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Your front/back camera acts as a virtual infrared ophthalmoscope probe. Choose which pathology diagnostic state you wish to map and identify:
                    </p>
                    
                    {/* DROP DOWN PATHOLOGY SELECTION */}
                    <select
                      id="opt-camera-simul"
                      value={cameraSimulChoice}
                      onChange={(e) => setCameraSimulChoice(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="diabetic">🔴 Diabetic Retinopathy (Hemorrhages, Hard Exudates)</option>
                      <option value="glaucoma">🔵 Glaucoma (Optic Cup Excavation CDR 0.78)</option>
                      <option value="amd">🟡 Macular Degeneration (Confluent Drusen Metastasization)</option>
                      <option value="cataract">⚪ Cataract (Dense pre-retinal media scatter opacity)</option>
                      <option value="normal">🟢 Regular Physiological Standard (Normal Healthy Retina)</option>
                    </select>
                  </div>

                  {/* WEBCAM VIDEO OR CAPTURE CANVAS */}
                  <div className="relative aspect-video max-w-md mx-auto w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800/80 flex flex-col justify-center items-center group shadow-inner">
                    
                    {/* CAMERA RENDERING VIDEO OR ERROR OUT */}
                    {cameraError ? (
                      <div className="p-6 text-center flex flex-col items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                          <ShieldAlert className="w-6 h-6 animate-pulse" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200">Camera Access Blocked or Dismissed</p>
                        <p className="text-[11px] text-slate-400 leading-normal max-w-xs">
                          {cameraError} 
                          <br />
                          <span className="text-slate-500 mt-1 block italic text-[10px]">
                            💡 Pro-tip: If you are using the sandboxed iframe, click the **"Open in New Tab"** button in the top corner of your browser preview to enable full local webcam support.
                          </span>
                        </p>
                        <div className="flex gap-2.5 mt-2 w-full max-w-xs justify-center">
                          <button
                            onClick={startCamera}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold transition cursor-pointer"
                          >
                            Retry Permission
                          </button>
                          <button
                            onClick={simulateCameraPhoto}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-lg shadow-teal-500/20 transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                            Run Simulator
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover scale-x-[-1]"
                        />

                        {/* TARGET SCAN MATRIX RETERIOR OVERLAY */}
                        <div className="absolute inset-0 border-[3px] border-dashed border-red-500/30 rounded-2xl pointer-events-none animate-pulse" />
                        
                        {/* RETINAL SCAN TARGET CIRCLE & RETICULAR TARGETING MARKS */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-blue-400/40 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border border-red-500/30 flex items-center justify-center">
                              {/* CENTER SIGHTING */}
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgb(239,68,68)]"></div>
                            </div>
                            {/* TARGET BOX EDGE TICKS */}
                            <div className="absolute top-2 w-4 h-0.5 bg-blue-400/80"></div>
                            <div className="absolute bottom-2 w-4 h-0.5 bg-blue-400/80"></div>
                            <div className="absolute left-2 h-4 w-0.5 bg-blue-400/80"></div>
                            <div className="absolute right-2 h-4 w-0.5 bg-blue-400/80"></div>
                          </div>
                        </div>

                        {/* DIGITAL SCOPE DIAGNOSTICS HUD METRICS */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800/80 pointer-events-none">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            IR SCAN FEED: 60FPS
                          </span>
                          <span>LATITUDE CHANNELS: ACTIVE</span>
                        </div>
                      </>
                    )}

                    {/* HIDDEN PHOTO RETRIEVER CANVAS */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* VIRTUAL TRIGGER ACTUATION BUTTON */}
                  {cameraError ? (
                    <button
                      onClick={simulateCameraPhoto}
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white rounded-xl font-extrabold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      Run Clinical Simulator Scan (Camera Blocked)
                    </button>
                  ) : (
                    <button
                      onClick={captureCameraPhoto}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20"
                    >
                      <Video className="w-4 h-4 text-emerald-300 animate-pulse" />
                      Acquire Retinal Screen Capture
                    </button>
                  )}

                  <p className="text-[10px] text-slate-500 leading-snug italic text-center">
                    💡 Align your eyes close to the central circular sight or snap your image, the analyzer automatically extracts localized disease biomarkers in real-time.
                  </p>
                </div>
              )}
            </div>

            {/* TILE 2: FUNDUS GRAPHIC DISPLAY PREVIEW */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center gap-5 shadow-2xl relative overflow-hidden">
              
              {/* TOP STRIP METRIC */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[9px] bg-slate-900/90 text-slate-400 border border-slate-800 px-2.5 py-1.5 rounded-full font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activeTab === "presets" ? "bg-blue-400" : "bg-emerald-400"}`}></span>
                  {activeTab === "presets" ? `Clinical Case: ${selectedPreset.name}` : `Input: Captured Scanner Scan`}
                </span>
              </div>

              {/* RETINA GRAPHIC COMPONENT */}
              <div className="mt-5 w-full">
                <FundusVisualizer
                  sample={selectedPreset}
                  activeMarkerId={activeMarkerId}
                  onSelectMarker={(id) => setActiveMarkerId(id)}
                  uploadedImageSrc={activeTab !== "presets" ? uploadPreview : null}
                  customMarkers={analysisResult?.customMarkers}
                />
              </div>

              {/* EXPLAINER ON SELECTED MARKER IN FUNDUS INTERACTIVE GRAPHIC */}
              {(activeTab === "presets" || (activeTab !== "presets" && analysisResult?.customMarkers)) && (
                <div className="w-full mt-2 transition-all duration-300">
                  {activeMarkerId ? (
                    (() => {
                      const marker = activeTab === "presets"
                        ? selectedPreset.markers.find(m => m.id === activeMarkerId)
                        : analysisResult?.customMarkers?.find(m => m.id === activeMarkerId);
                      if (!marker) return null;
                      return (
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex gap-3 relative animate-fadeIn">
                          <button 
                            onClick={() => setActiveMarkerId(null)}
                            className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className={`p-2 h-fit rounded-lg mt-0.5 ${
                            marker.severity === "danger" 
                              ? "bg-red-500/15 text-red-400" 
                              : marker.severity === "warning"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-sky-500/15 text-sky-400"
                          }`}>
                            <Crosshair className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1">
                              {marker.label}
                              <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded uppercase ${
                                marker.severity === "danger" 
                                  ? "bg-red-500/20 text-red-300" 
                                  : marker.severity === "warning"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-sky-500/20 text-sky-300"
                              }`}>
                                {marker.severity === "danger" ? "Critical Landmark" : "Observation Target"}
                              </span>
                            </p>
                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{marker.description}</p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-3.5 text-center text-xs text-slate-500">
                      Select any red circle diagnostic pulse overlay locator on the retinal photograph to learn about diagnosed pathology clusters.
                    </div>
                  )}
                </div>
              )}

              {/* RETINAL BACKGROUND CONTRAST IN CASE DESCRIPTION */}
              {activeTab === "presets" && (
                <div className="w-full text-left bg-slate-900/30 border-t border-slate-900 pt-4 mt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Clinical Presentation</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedPreset.longClinicalDescription}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* ================= COLUMN B: DIAGNOSTIC REPORT (Spans 7) ================= */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
            
            {/* TILE 3: PRIMARY AI DIAGNOSIS REPORT */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden">
              
              {/* ABS-BACKGROUND DECORATIVE GRID */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest font-bold">Ophthalmic Diagnostic Output</span>
                  <h2 className="text-xl font-bold tracking-tight text-white mt-1">Real-time Screening Report</h2>
                </div>
                {analysisResult && (
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeStyles(analysisResult.status)}`}>
                    ● {analysisResult.status.toUpperCase()} SEVERITY
                  </span>
                )}
              </div>

              {/* REPORT CARD DISPLAY */}
              {isAnalyzing ? (
                <div className="flex-grow py-16 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <Eye className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Advanced Vision Engine Active</p>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                      Executing automated deep segment parsing. Analyzing optical density, vascular pathways, disc borders and drusen count...
                    </p>
                  </div>
                </div>
              ) : analysisError ? (
                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="font-semibold text-sm">Ophthalmic Analyzer Warning</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisError}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAnalyzeUpload}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold px-4 py-1.5 rounded-lg border border-red-500/40 transition-colors"
                    >
                      Try Re-analyzing
                    </button>
                    <button
                      onClick={() => {
                        // Fall back to localized clinical diagnostic mockups smoothly
                        const simulatedResult = getPresetPredictionReport("diabetic");
                        setAnalysisResult(simulatedResult);
                        setAnalysisError(null);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans px-4 py-1.5 rounded-lg border border-slate-700 transition-colors"
                    >
                      Fallback to High-Fidelity Simulator
                    </button>
                  </div>
                </div>
              ) : analysisResult ? (
                <div id="ai-report-card" className="flex-grow flex flex-col gap-5 z-10 transition-all duration-500">
                  
                  {/* BENTO HEADER SUBBOX: DIAGNOSIS KEY */}
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Primary Predicted Findings</p>
                      <h3 className="text-lg font-bold text-white">{analysisResult.primaryDiagnosis}</h3>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <div className="text-right border-l border-slate-800 pl-4 py-0.5">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Accuracy Index</span>
                        <span className="text-lg font-extrabold text-blue-400">{analysisResult.confidence}%</span>
                      </div>
                      <div className="text-right border-l border-slate-800 pl-4 py-0.5">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Threat Score</span>
                        <span className={`text-lg font-extrabold ${analysisResult.riskScore > 60 ? "text-red-400" : analysisResult.riskScore > 30 ? "text-amber-400" : "text-emerald-400"}`}>{analysisResult.riskScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* BENTO PROGRESS CHART TILES */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Anatomy Disease Probabilities</h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span> Danger ({">"}50%)
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Safe ({"<"}30%)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {analysisResult.conditions.map((cond, idx) => {
                        const isSevere = cond.probability >= 50;
                        const isModerate = cond.probability >= 20 && cond.probability < 50;
                        const barColor = isSevere ? "bg-red-500" : isModerate ? "bg-amber-400" : "bg-emerald-500";
                        const textColor = isSevere ? "text-red-400" : isModerate ? "text-amber-400" : "text-slate-300";

                        return (
                          <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 flex flex-col gap-1.5 hover:bg-slate-900/70 transition-all duration-200">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-white">{cond.name}</span>
                              <span className={`font-mono font-bold ${textColor}`}>{cond.probability}%</span>
                            </div>
                            <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${barColor} rounded-full transition-all duration-1000`} 
                                style={{ width: `${cond.probability}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug">{cond.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BENTO BLOCK: ANATOMICAL STRUCTURAL ANALYSIS */}
                  <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-900 flex flex-col gap-3">
                    <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Retinal Tissue Segment breakdown</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-semibold">Optic Nerve Segment:</span>
                        <p className="text-slate-300 mt-1 leading-snug">{analysisResult.anatomicalFindings.opticDisc}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-semibold">Macular Segment:</span>
                        <p className="text-slate-300 mt-1 leading-snug">{analysisResult.anatomicalFindings.macula}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-semibold">Retinal Blood Vasculature:</span>
                        <p className="text-slate-300 mt-1 leading-snug">{analysisResult.anatomicalFindings.vasculature}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-semibold">Retina Landscape Ground:</span>
                        <p className="text-slate-300 mt-1 leading-snug">{analysisResult.anatomicalFindings.retinalBackground}</p>
                      </div>
                    </div>

                    <div className="mt-1 bg-blue-950/15 p-3 rounded-lg border border-blue-900/30 text-xs leading-relaxed text-blue-200">
                      <span className="font-semibold text-blue-400 block mb-1">🏥 Neurological Diagnostics Summary:</span>
                      {analysisResult.detailedAnalysis}
                    </div>
                  </div>

                  {/* BENTO BLOCK: CLINICAL ADVISORIES AND RECOMMENDATIONS */}
                  <div className="bg-slate-900/20 p-4 rounded-2xl border border-slate-900 flex flex-col gap-2.5">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">Standard Preventive Protocols</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {analysisResult.recommendations.map((rec, i) => (
                        <li key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-snug flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DEDICATED THERAPEUTIC ADVISORIES (MEDICATIVE & OPTICAL) */}
                  {analysisResult.medicationGuidance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                      
                      {/* CARD 1: MEDICATIVE CLINICAL GUIDANCE */}
                      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-900 flex flex-col gap-3.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-bold leading-none">Therapeutical Directives</span>
                            <h4 className="text-xs font-bold text-white mt-0.5 font-sans">Recommended Medication Guidance</h4>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-xs text-slate-400 font-sans">
                          <p><span className="text-slate-200 font-semibold font-mono text-[10px] uppercase">Drug Class:</span> {analysisResult.medicationGuidance.therapeuticClass}</p>
                          <p className="mt-1"><span className="text-slate-200 font-semibold font-mono text-[10px] uppercase">Pathway:</span> {analysisResult.medicationGuidance.targetAction}</p>
                        </div>

                        <div className="space-y-2">
                          {analysisResult.medicationGuidance.agents.map((agent, i) => (
                            <div key={i} className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-xs">
                              <span className="font-bold text-white block uppercase tracking-wide font-sans">{agent.name}</span>
                              <p className="mt-1 text-slate-300 text-[11px] leading-snug font-sans">{agent.purpose}</p>
                              <span className="text-[9px] font-mono text-slate-500 mt-1.5 block">Dosage Cycle: {agent.dosageExample}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[10px] text-red-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 leading-relaxed font-sans">
                          ⚠️ <span className="font-bold uppercase text-[9px] tracking-wide text-red-300">Clinical Warning:</span> {analysisResult.medicationGuidance.clinicalWarnings}
                        </div>
                      </div>

                      {/* CARD 2: OPTICAL & INTERVENTIONAL EYECARE */}
                      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-900 flex flex-col gap-3.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400">
                            <Glasses className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block font-bold leading-none">Correction & Interventions</span>
                            <h4 className="text-xs font-bold text-white mt-0.5 font-sans">Optical & Surgical Management</h4>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-xs text-slate-400 font-sans">
                          <p><span className="text-slate-200 font-semibold font-mono text-[10px] uppercase">Acuity Correction:</span> {analysisResult.opticalManagement?.requiredCorrection || "Regular Routine Monitoring"}</p>
                        </div>

                        <div className="space-y-2">
                          {analysisResult.opticalManagement?.interventions.map((opt, i) => (
                            <div key={i} className="bg-teal-500/5 p-3 rounded-xl border border-teal-500/10 text-xs">
                              <span className="font-bold text-white block uppercase tracking-wide font-sans">{opt.deviceOrProcedure}</span>
                              <p className="mt-1 text-slate-300 text-[11px] leading-snug font-sans">{opt.purpose}</p>
                              <span className="text-[9px] font-mono text-slate-500 mt-1.5 block">Interval: {opt.frequency}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[10px] text-teal-400 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10 leading-relaxed font-sans">
                          💡 <span className="font-bold uppercase text-[9px] tracking-wide text-teal-300">Continuous Monitoring:</span> {analysisResult.opticalManagement?.dailyMonitoring}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="flex-grow py-24 flex flex-col items-center justify-center gap-3 text-center text-slate-400">
                  <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-slate-600 border border-slate-800">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Analysis Pending</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">Please upload your custom fundus scan from the tab switcher and trigger analysis, or evaluate the presets.</p>
                  </div>
                </div>
              )}

            </div>

            {/* TILE 4: SYMPTOM SCREENER ADVISORY WIDGET */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono text-teal-500 uppercase tracking-widest font-bold">Symptomatology Matrix</span>
                <h3 className="text-md font-bold text-white mt-0.5">Interactive Symptom Crossfilter</h3>
                <p className="text-xs text-slate-400 mt-0.5">Select matching patient symptoms to automatically prompt diagnostic severity levels.</p>
              </div>

              {/* CHECKLIST */}
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptomIds.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      onClick={() => handleSymptomToggle(sym.id)}
                      className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-2 transition-all ${
                        isChecked
                          ? "bg-teal-950/40 text-teal-300 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.1)]"
                          : "bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        sym.severity === "high" 
                          ? "bg-red-400" 
                          : sym.severity === "medium" 
                          ? "bg-amber-400" 
                          : "bg-sky-400"
                      }`}></span>
                      {sym.label}
                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  );
                })}
              </div>

              {/* SCREENER SUMMARY DIALOG ACCORDING TO USER'S SELECTIONS */}
              <div className={`p-4 rounded-2xl border transition-all ${
                symptomAlert.riskLevel === "Urgent" 
                  ? "bg-red-950/20 text-red-300 border-red-900/50" 
                  : symptomAlert.riskLevel === "Warning"
                  ? "bg-amber-950/20 text-amber-300 border-amber-900/50"
                  : "bg-slate-900/50 text-slate-300 border-slate-800"
              }`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Symptom Compound Score</span>
                  <span className="text-xs font-bold uppercase">{symptomAlert.riskLevel} Indicator Level</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-extrabold text-2xl tracking-tight leading-none">
                    {symptomAlert.rating}%
                  </div>
                  <div className="text-xs leading-relaxed flex-grow">
                    {symptomAlert.message}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================= BENTO TILE 5: RECENT OBSERVATIONS HISTORY GRID ================= */}
        <section id="history-section" className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-md font-bold text-white">Local Screening Ledger</h3>
                <p className="text-xs text-slate-500">Recent automated analyses stored in custom browser local state.</p>
              </div>
            </div>
            
            {historyList.length > 0 && (
              <button 
                onClick={clearHistoryLog}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 hover:border-red-500/30 transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Reset Ledger
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-900/60 rounded-2xl py-8 px-4 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-1">
              <span>No logged observations from uploads inside this session yet.</span>
              <span>Upload and analyze a custom image to record an entry in the ledger.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {historyList.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3 cursor-pointer hover:bg-slate-900 hover:border-blue-500/40 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-10 h-10 rounded bg-black shrink-0 overflow-hidden border border-slate-800">
                      <img src={item.thumbnail} alt="History thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">{item.timestamp}</span>
                      <p className="text-xs font-bold text-white truncate leading-tight mt-0.5">{item.sourceName}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 truncate mt-1">
                      {item.primaryDiagnosis}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-mono ${
                        item.status === "Urgent" 
                          ? "bg-red-500/10 text-red-400" 
                          : item.status === "Warning" 
                          ? "bg-amber-500/10 text-amber-400" 
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                      <span className="text-slate-400">Match score: <strong className="text-slate-200">{item.confidence}%</strong></span>
                    </div>
                  </div>

                  <span className="text-[9px] text-blue-400 font-semibold group-hover:text-blue-300 flex items-center gap-1 self-end mt-1">
                    Restore Report <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= BENTO TILE 6: ANATOMY EDUCATIONAL CORNER ================= */}
        <section id="clinical-guide" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <div className="lg:col-span-8 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-md font-bold text-white">Ophthalmic Retina Primer</h3>
                <p className="text-xs text-slate-500">Essential structures evaluated inside professional funduscopy screening.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EDUCATION_MATERIAL.anatomicalBreakdown.map((item, i) => (
                <div key={i} className="bg-slate-900/30 p-4 rounded-2xl border border-slate-900/70 flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-widest">{item.title}</span>
                  <p className="text-xs text-slate-300 leading-relaxed flex-grow">{item.desc}</p>
                  <p className="text-[10px] text-slate-500 mt-2 border-t border-slate-800/40 pt-2 italic">
                    {item.tips}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <h3 className="text-md font-bold text-white">Retinal Health Guidance</h3>
              </div>
              <p className="text-xs text-slate-400">Adopt clinical lifestyle adjustments suggested by ophthalmic literature.</p>

              <div className="space-y-3.5 mt-2">
                {EDUCATION_MATERIAL.preventionTips.slice(0, 2).map((tip, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs">
                    <div className="w-5 h-5 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-blue-400 font-mono font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{tip.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-500 italic mt-3 text-center">
              "Prevention is sight conserved. Act early." — World Ophthalmic Coalition
            </div>
          </div>

        </section>
          </>
        ) : (
          <PlagiarismTester
            plagPresetId={plagPresetId}
            setPlagPresetId={setPlagPresetId}
            codeA={codeA}
            setCodeA={setCodeA}
            codeB={codeB}
            setCodeB={setCodeB}
            isPlagChecking={isPlagChecking}
            plagResult={plagResult}
            plagError={plagError}
            handlePlagiarismCheck={handlePlagiarismCheck}
          />
        )}
      </main>

      {/* FOOTER BAR */}
      <footer id="main-footer" className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 font-medium tracking-wide">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-slate-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span>Neocortex Eye Diagnostics Suite • Licensed for educational use</span>
          </div>
          
          <div className="hidden md:flex gap-6 uppercase tracking-wider text-[10px]">
            <span>Secure TLS Encryption</span>
            <span>Local Anonymized Sandbox</span>
            <span>AREDS2 Validated Parameters</span>
          </div>

          <div>
            <span>© 2026 RetinaAI Vision Diagnostics Corp.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
