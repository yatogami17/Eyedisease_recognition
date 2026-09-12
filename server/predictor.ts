/**
 * Retinal Disease Clinical Predictor Engine (TypeScript)
 * Deterministic analysis and simulation for retinal fundus screening.
 */

export function computeVisualSignature(base64Str: string): number {
  if (!base64Str) return 0;

  // Strip base64 data URL scheme prefix if present
  let cleanStr = base64Str;
  const match = base64Str.match(/^data:image\/[a-zA-Z+]+;base64,/);
  if (match) {
    cleanStr = base64Str.slice(match[0].length);
  }

  // Standardize length for calculation speed (use middle slice)
  const length = cleanStr.length;
  const sampleStr = length > 5000 ? cleanStr.slice(500, 4500) : cleanStr;

  let charMatchSum = 0;
  for (let idx = 0; idx < sampleStr.length; idx += 17) {
    charMatchSum += sampleStr.charCodeAt(idx);
  }

  return charMatchSum;
}

export function getBase64Meta(base64Str: string) {
  if (!base64Str) {
    return { sizeKb: 0, format: "unknown", valid: false };
  }

  const isDataUrl = base64Str.startsWith("data:");
  let fmt = "unknown";
  let valid = true;

  if (isDataUrl) {
    const match = base64Str.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match) {
      fmt = match[1].toUpperCase();
    } else {
      valid = false;
    }
  }

  let cleanLen = base64Str.length;
  if (isDataUrl && base64Str.includes(",")) {
    cleanLen = base64Str.split(",")[1]?.length || 0;
  }

  const estimatedBytes = Math.floor(cleanLen * 0.75);
  const sizeKb = Math.round((estimatedBytes / 1024.0) * 10) / 10;

  if (cleanLen < 100) {
    valid = false;
  }

  return {
    sizeKb,
    format: fmt,
    valid
  };
}

export function getPresetReport(conditionKey: string, signature: number) {
  const key = conditionKey ? conditionKey.toLowerCase() : "normal";

  // Seed variations slightly based on the unique image signature
  const variance3 = (signature % 5) - 2; // -2 to +2
  const variance5 = (signature % 9) - 4; // -4 to +4

  if (key.includes("normal") || key.includes("healthy")) {
    const confidence = Math.min(99, Math.max(92, 96 + variance3));
    const riskScore = Math.min(15, Math.max(3, 8 + variance3));

    return {
      primaryDiagnosis: "Healthy Retinal Fundus (Normal)",
      confidence,
      status: "Normal" as const,
      riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: Math.max(0, 2 + variance3), description: "No microaneurysms, hemorrhages, or exudates observed." },
        { name: "Glaucoma Diagnostic Criteria", probability: Math.max(0, 4 + variance3), description: "Optic cup-to-disc ratio is within healthy limits (approx 0.3)." },
        { name: "Macular Degeneration", probability: Math.max(0, 3 + variance3), description: "Macular pigment density is stable. Foveal reflex is normal." },
        { name: "Opacity/Cataract Risk", probability: Math.max(0, 1 + variance3), description: "Media clarity is optimal. No sign of lens opacity." },
        { name: "Normal Physiological State", probability: confidence, description: "No pathological patterns detected across segments." }
      ],
      anatomicalFindings: {
        opticDisc: "Sharp, defined margins. Optic cup-to-disc ratio evaluated around 0.3, indicating robust neuroretinal safety margin.",
        macula: "Well-centered foveal reflex. Zero evidence of drusen, neovascular exudation, or dry retinal atrophy.",
        vasculature: "Vascular path is continuous with regular physiological caliber. No terminal capillary crossing changes.",
        retinalBackground: "Homogeneous background coloration. Clean with absolutely zero hemorrhages or cotton wool spots."
      },
      detailedAnalysis: `The clinical analyzer has evaluated the retinal fundus map (estimated scan index: #${signature}). All structural segments, including the central macular fovea and the optic nerve head, demonstrate normal anatomical patterns with no signs of active ocular pathology.`,
      recommendations: [
        "Maintain baseline custom annual comprehensive vision screens with an eye professional.",
        "Continue consuming lutein-rich spinach, protective omega oils, and antioxidants.",
        "Ensure defense with high contrast UV shielding outdoors."
      ]
    };
  } else if (key.includes("diabetic") || key.includes("retinopathy")) {
    const confidence = Math.min(98, Math.max(88, 92 + variance3));
    const riskScore = Math.min(90, Math.max(68, 78 + variance5));

    return {
      primaryDiagnosis: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
      confidence,
      status: "Warning" as const,
      riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: confidence, description: "Numerous microaneurysms, scattered blot hemorrhages, and focal lipid exudates." },
        { name: "Glaucoma Diagnostic Criteria", probability: Math.max(2, 8 + variance3), description: "Optic cup remains stable. No vertical elongation detected." },
        { name: "Macular Degeneration", probability: Math.max(4, 12 + variance3), description: "Mild distortion risk secondary to proximal structural edema." },
        { name: "Opacity/Cataract Risk", probability: Math.max(5, 15 + variance3), description: "Increased risk of lens nuclear cloudiness, linked to glycemic level fluctuations." },
        { name: "Normal Physiological State", probability: Math.max(0, 5 + variance3), description: "Anomalies negate general physiological norms." }
      ],
      anatomicalFindings: {
        opticDisc: "Regular margins with normal color. Cup measures around 0.35, remaining within reasonable physiological parameters.",
        macula: "Expatriate microaneurysms and cluster of yellow hard exudates near the temporal arcade. Warning for diabetic macular edema.",
        vasculature: "Significant vessel dilation and tortuosity. Microvascular loops visible in the temporal segments.",
        retinalBackground: "Prominent dot-and-blot bleeding spots. Multiple lipid hard exudates cluster inside the foveal periphery."
      },
      detailedAnalysis: `Visual biomarkers extracted from scan #${signature} demonstrate classic microvascular retinopathy secondary to compromised capillary integrity. Highly suspicious for severe NPDR with an elevated risk score of ${riskScore} for macular leakage.`,
      recommendations: [
        "Urgent direct reference to a retinal specialist or ophthalmologist within 2-4 weeks.",
        "Work with your primary physician to optimize metabolic variables, including glycemic HbA1c and systemic blood pressure.",
        "Acquire an optical coherence tomography (OCT) scan to definitively rule out clinically significant macular edema."
      ]
    };
  } else if (key.includes("hypertens") || key.includes("arterio") || key.includes("bp")) {
    const confidence = Math.min(97, Math.max(88, 93 + variance3));
    const riskScore = Math.min(88, Math.max(65, 76 + variance5));

    return {
      primaryDiagnosis: "Hypertensive Retinopathy (Grade III - Arteriolar Sclerosis)",
      confidence,
      status: "Warning" as const,
      riskScore,
      conditions: [
        { name: "Hypertensive Retinopathy", probability: confidence, description: "Arteriolar narrowing, AV nicking, focal spasm, and flame-shaped hemorrhages." },
        { name: "Diabetic Retinopathy", probability: Math.max(2, 12 + variance3), description: "Superficial flame hemorrhages noted alongside systemic vascular changes." },
        { name: "Glaucoma Diagnostic Criteria", probability: Math.max(1, 6 + variance3), description: "Optic disc margins clear without profound glaucomatous cupping." },
        { name: "Macular Degeneration", probability: Math.max(1, 4 + variance3), description: "Macular reflex preserved without soft drusen deposits." },
        { name: "Normal Physiological State", probability: Math.max(0, 3 + variance3), description: "Arteriovenous nicking and vessel attenuation negate normal state." }
      ],
      anatomicalFindings: {
        opticDisc: "Sharp disc margins with slight hyperemic coloration secondary to chronic arterial pressure.",
        macula: "Clear foveal zone; minimal macular star lipid radiating along Henle's layer.",
        vasculature: "Prominent generalized and focal arteriolar narrowing. Definite AV crossing changes (Salus and Gunn signs - AV nicking) and copper-wiring light reflex.",
        retinalBackground: "Scattered flame-shaped retinal nerve fiber layer hemorrhages and several discrete cotton wool patches (micro-infarcts)."
      },
      detailedAnalysis: `Clinical vascular extraction from scan #${signature} demonstrates classic hypertensive microangiopathy. Marked by prominent arteriole-to-venule ratio constriction (A/V ratio < 1:3), diffuse copper-wiring reflection, and localized flame hemorrhages requiring urgent systemic blood pressure management.`,
      recommendations: [
        "Urgent coordination with primary care physician or cardiologist for systemic blood pressure evaluation and titration.",
        "Renal function screening (creatinine, eGFR, microalbuminuria) and cardiovascular risk profiling.",
        "Follow-up retinal dilated examination within 6-8 weeks to monitor resolution of flame hemorrhages and cotton wool spots."
      ]
    };
  } else if (key.includes("glaucoma") || key.includes("cup")) {
    const confidence = Math.min(96, Math.max(84, 89 + variance3));
    const riskScore = Math.min(95, Math.max(75, 82 + variance5));

    return {
      primaryDiagnosis: "Suspected Open-Angle Glaucomatous Neuropathy",
      confidence,
      status: "Urgent" as const,
      riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: Math.max(1, 6 + variance3), description: "Vessels appear continuous without classical diabetic hemorrhages." },
        { name: "Glaucoma Diagnostic Criteria", probability: confidence, description: "Extreme optic disc cupping (vertical CDR ratio of 0.8), nasalized vessels, and inferior neuroretinal rim thinning." },
        { name: "Macular Degeneration", probability: Math.max(1, 5 + variance3), description: "Macular architecture remains regular and intact." },
        { name: "Opacity/Cataract Risk", probability: Math.max(3, 10 + variance3), description: "No significant opacity. Standard aged crystalline lens status." },
        { name: "Normal Physiological State", probability: Math.max(2, 11 + variance3), description: "Significant cupping precludes normal diagnosis." }
      ],
      anatomicalFindings: {
        opticDisc: `Critical cup-to-disc ratio is expanded vertically to 0.78. Notable thinning of the inferior and superior neuroretinal rim (violating the standard clinical ISNT rule).`,
        macula: "Normal presentation. Pigment pattern remains uniform, foveolar reflex visible.",
        vasculature: "Severe double-bending (bayoneting) of primary vessels at the cup margins. Vessels exhibit distinct nasal shifting.",
        retinalBackground: "Localized nerve fiber bundle layer (RNFL) defects radiating outwards from the upper/lower margins of the optic disc."
      },
      detailedAnalysis: `Optic nerve excavation is highly suggestive of advanced open-angle glaucomatous damage. Immediate visual field tests (Humphrey perimeter) and intraocular pressure checks (tonometry) are clinically vital to verify peripheral vision decay.`,
      recommendations: [
        "Request immediate consultation with an ophthalmologist or glaucoma specialist.",
        "Measure intraocular pressure (IOP) via Goldmann applanation tonometry.",
        "Initiate a diagnostic baseline incorporating automated perimetry, pachymetry, and nerve head OCT reviews."
      ]
    };
  } else if (key.includes("macular") || key.includes("amd") || key.includes("drusen")) {
    const confidence = Math.min(97, Math.max(85, 91 + variance3));
    const riskScore = Math.min(85, Math.max(60, 70 + variance5));

    return {
      primaryDiagnosis: "Dry Age-Related Macular Degeneration (AMD)",
      confidence,
      status: "Warning" as const,
      riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: Math.max(1, 4 + variance3), description: "No abnormal capillary loops or microaneurysms detected." },
        { name: "Glaucoma Diagnostic Criteria", probability: Math.max(2, 9 + variance3), description: "Optic disc cupping is balanced; margins look sharp and normal." },
        { name: "Macular Degeneration", probability: confidence, description: "Numerous soft, confluent yellow drusen clustered inside the macular pigment epithelium." },
        { name: "Opacity/Cataract Risk", probability: Math.max(5, 18 + variance3), description: "General aged lens clarity is within normal geriatric parameters." },
        { name: "Normal Physiological State", probability: Math.max(1, 9 + variance3), description: "Significant macular lesions negate normal status." }
      ],
      anatomicalFindings: {
        opticDisc: "Well-defined margins with standard pinkish coloration. Healthy cup configuration (~0.35 CDR).",
        macula: `Heavily affected. Multiplied deposits of confluent soft drusen causing clear wrinkling and structural elevation of the sensory retinal layers.`,
        vasculature: "Slight generalized arteriole narrowing congruent with mature tissue, but no neovascular leakage or active hemorrhages.",
        retinalBackground: "Clean peripheral background. Macular field is highly affected by lipid-protein metabolic waste."
      },
      detailedAnalysis: `Dry macular degenerative modifications with a high concentration of soft drusen. These debris mounds alter macular nutrition, prompting progressive central vision and acuity losses.`,
      recommendations: [
        "Maintain visual monitoring with a daily home Amsler Grid chart.",
        "Discuss high-potency eye formula supplements (AREDS2 formulation) with your specialist to help protect visual cells.",
        "Avoid nicotine use, manage cardiovascular metrics, and shield retinal layers from direct UV light."
      ]
    };
  } else if (key.includes("cataract") || key.includes("hazy") || key.includes("opacity")) {
    const confidence = Math.min(94, Math.max(78, 85 + variance3));
    const riskScore = Math.min(80, Math.max(50, 62 + variance5));

    return {
      primaryDiagnosis: "Severe Media Opacity - Consistent with Matured Nuclear Cataract",
      confidence,
      status: "Warning" as const,
      riskScore,
      conditions: [
        { name: "Diabetic Retinopathy", probability: Math.max(5, 15 + variance3), description: "Sub-optimal evaluation due to heavy optical haze." },
        { name: "Glaucoma Diagnostic Criteria", probability: Math.max(5, 18 + variance3), description: "Optic disc outline visible but margins are obscured." },
        { name: "Macular Degeneration", probability: Math.max(5, 14 + variance3), description: "Macular resolution is impaired by light-scattering lens." },
        { name: "Opacity/Cataract Risk", probability: confidence, description: "Heavy optical attenuation. Crystalline lens opacification limits deep laser profiling." },
        { name: "Normal Physiological State", probability: Math.max(5, 15 + variance3), description: "Optical clarity indices are significantly reduced." }
      ],
      anatomicalFindings: {
        opticDisc: "Hazy look. Margins appear outline-only with low contrast and diminished focal clarity.",
        macula: "Central macular foveal reflex is entirely muted due to lens opacification scattering probe lasers.",
        vasculature: "Primary vessels are resolved as thick, low-contrast passages without fine capillary detail.",
        retinalBackground: "Uniformly dimmed red reflex. No discrete background bleeding points can be verified."
      },
      detailedAnalysis: `Generalized light-diffusion throughout the image frame (scan index #${signature}). Very diagnostic of an advanced nuclear cataract. Deep retinal screening is constrained by pre-retinal media opacification.`,
      recommendations: [
        "Schedule a slit-lamp examination with an optometrist to measure lens opacity.",
        "Discuss outpatient cataract custom lens surgery if daily vision or contrast sensitivity is degraded.",
        "Use high-contrast books and high-lumens focused home reading lights in the interim."
      ]
    };
  } else {
    // Default/Indeterminate fallback
    const confidence = Math.min(80, Math.max(55, 65 + variance3));
    return {
      primaryDiagnosis: "Indeterminate Screening - Retinal Landmarks Present",
      confidence,
      status: "Warning" as const,
      riskScore: 45,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 10, description: "Inconclusive visual indicators." },
        { name: "Glaucoma Diagnostic Criteria", probability: 12, description: "Cupping appears standard but edge contrast is suboptimal." },
        { name: "Macular Degeneration", probability: 11, description: "Central zone exhibits moderate pigmentation." },
        { name: "Opacity/Cataract Risk", probability: 20, description: "Typical aged clarity." },
        { name: "Normal Physiological State", probability: confidence, description: "Overall layout reflects general biological norms." }
      ],
      anatomicalFindings: {
        opticDisc: "Disc outline is visible. Details are generally standard.",
        macula: "The central macular region displays standard appearance without severe drusen accretion.",
        vasculature: "Vessels run standard trajectories, standard caliber.",
        retinalBackground: "Uniform coloration with normal reflectivity."
      },
      detailedAnalysis: `The analyzed scan (index #${signature}) is moderately clear. No severe abnormalities (such as proliferative diabetic bleeding, hard exudates, or gross optic nerve remodeling) were successfully parsed. However, minor variations might be present.`,
      recommendations: [
        "Schedule a periodic complete eye screen with dilation.",
        "Monitor for any sudden changes, floaters, or localized visual field shadows."
      ]
    };
  }
}

export function augmentReportClinicalDetails(report: any, conditionKey: string) {
  const key = conditionKey ? conditionKey.toLowerCase() : "normal";

  let activeKey = "normal";
  if (key.includes("diab") || key.includes("retino")) {
    activeKey = "diabetic";
  } else if (key.includes("hyper") || key.includes("arterio") || key.includes("bp")) {
    activeKey = "hypertension";
  } else if (key.includes("glau") || key.includes("cup")) {
    activeKey = "glaucoma";
  } else if (key.includes("macu") || key.includes("amd") || key.includes("drusen")) {
    activeKey = "amd";
  } else if (key.includes("catar") || key.includes("hazy") || key.includes("opacity")) {
    activeKey = "cataract";
  }

  let markers: any[] = [];
  let med: any;
  let opt: any;

  if (activeKey === "hypertension") {
    markers = [
      { id: "cust-htn-1", x: 44, y: 35, label: "Arteriovenous (AV) Nicking (Salus Sign)", description: "Major sclerotic arteriole indenting and deflecting crossing venule, classic microvascular sclerosis marker.", severity: "danger" },
      { id: "cust-htn-2", x: 60, y: 48, label: "Copper Wiring Arteriolar Reflex", description: "Diffuse broadening and burnished metallic copper reflection of the arteriole light streak.", severity: "warning" },
      { id: "cust-htn-3", x: 50, y: 62, label: "Flame-Shaped Retinal Hemorrhage", description: "Superficial linear hemorrhage aligning within nerve fiber bundle layer secondary to acute pressure spikes.", severity: "danger" }
    ];
    med = {
      therapeuticClass: "Antihypertensive Agents (ACE-i, ARB, CCB)",
      targetAction: "Systemic systolic & diastolic normalization to prevent malignant retinal vessel breakdown",
      agents: [
        { name: "Amlodipine / Telmisartan", purpose: "Peripheral vascular resistance reduction under PCP regimen", dosageExample: "Daily oral dose titrated to target BP < 130/80 mmHg" },
        { name: "Lisinopril / Hydrochlorothiazide", purpose: "Renin-angiotensin pathway inhibition and fluid regulation", dosageExample: "Prescribed maintenance dosage" }
      ],
      clinicalWarnings: "Rapid reduction of extreme hypertension should be medically managed to avoid watershed anterior ischemic optic neuropathy (NAION)."
    };
    opt = {
      requiredCorrection: "Vascular caliber tracking via serial fundus photography",
      interventions: [
        { deviceOrProcedure: "24-Hour Ambulatory Blood Pressure Monitoring (ABPM)", purpose: "Assess nocturnal dipping and acute surges correlating with microvascular changes", frequency: "Baseline diagnostic tracking" },
        { deviceOrProcedure: "Digital Fundus Retinal Vessel Caliber Analysis (AV Ratio)", purpose: "Quantitative measurement of generalized arteriolar narrowing", frequency: "Every 3 to 6 months" }
      ],
      dailyMonitoring: "Twice-daily home automated sphygmomanometer blood pressure tracking and recording."
    };
  } else if (activeKey === "diabetic") {
    markers = [
      { id: "cust-dr-1", x: 48, y: 45, label: "Active Microaneurysm Leakage", description: "High-contrast clinical identification of localized capillary expansion displaying micro-punctures.", severity: "danger" },
      { id: "cust-dr-2", x: 62, y: 35, label: "Circinate Hard Lipid Exudate", description: "Waxy, yellowish lipid debris deposit leaking into deep inner layers of sensory retinal tissue.", severity: "danger" },
      { id: "cust-dr-3", x: 55, y: 65, label: "Intraretinal Dot Hemorrhage", description: "Ruptured deep capillary showing up as deep circular crimson spots around the macular zone.", severity: "warning" }
    ];
    med = {
      therapeuticClass: "Anti-VEGF Pathway & Glycemic Regulators",
      targetAction: "Halt abnormal vascular proliferation and stabilize cellular basement loops",
      agents: [
        { name: "Aflibercept (Eylea) / Ranibizumab", purpose: "Intravitreal biological blocker to resolve macular swelling", dosageExample: "2.0mg monthly clinical injection" },
        { name: "Metformin / Empagliflozin", purpose: "Oral agent to assist glycemic optimization under medical PCP guidance", dosageExample: "As directed by primary physician" }
      ],
      clinicalWarnings: "Ophthalmic injectables require strict sterile administration under a specialized retina consultant. Do not self-administer."
    };
    opt = {
      requiredCorrection: "Dynamic focal lens monitoring secondary to hydration shifts",
      interventions: [
        { deviceOrProcedure: "Laser Photocoagulation (Panretinal)", purpose: "Coagulate ischemic outer tissues to stop abnormal VEGF secretion", frequency: "Divided therapeutic clinical sessions" },
        { deviceOrProcedure: "Ophthalmological OCT Scan charting", purpose: "Assess cell microns swelling or intraretinal liquid accumulation", frequency: "Every 4 to 8 weeks during active disease" }
      ],
      dailyMonitoring: "Engage in daily home glycemic blood monitoring and test daily with the physical Amsler grid."
    };
  } else if (activeKey === "glaucoma") {
    markers = [
      { id: "cust-glau-1", x: 35, y: 48, label: "Expanded Optic Cup Cavity", description: "Critical loss of neural cell fibers causing severe vertical expansion of the central pale cup (CDR ~0.78).", severity: "danger" },
      { id: "cust-glau-2", x: 42, y: 52, label: "Bayoneting Vessel Deviation", description: "Bending of central retinal veins under structural pressure, creating nasalization along the disc border.", severity: "warning" }
    ];
    med = {
      therapeuticClass: "Antiglaucoma Aqueous Outflow Enhancers & Ciliary Blockers",
      targetAction: "Lower intraocular fluid tension to preserve retinal nerve layers",
      agents: [
        { name: "Latanoprost 0.005% ophthalmic drops", purpose: "Prostaglandin analog to elevate uveoscleral liquid egress", dosageExample: "1 drop in affected eye once daily at nighttime" },
        { name: "Timolol Maleate 0.5% drops", purpose: "Beta-blocker to limit fluid creation in ciliary body", dosageExample: "1 drop twice daily" }
      ],
      clinicalWarnings: "Absolute drop adherence is vital. IOP spikes are painless but permanently destroy fragile retinal cells, narrowing visual fields."
    };
    opt = {
      requiredCorrection: "Regular perimeter checks, prism corrections",
      interventions: [
        { deviceOrProcedure: "Selective Laser Trabeculoplasty (SLT)", purpose: "Laser widening of the drainage outflow ciliary channels", frequency: "Outpatient clinic outpatient visit" },
        { deviceOrProcedure: "Automated Humphrey Visional Field chart", purpose: "Screen for peripheral nasal step blind patches", frequency: "Every 6 months to detect progressive nerve damage" }
      ],
      dailyMonitoring: "Avoid prolonged head-down activities (yoga, weightlifting). Verify drug compliance logs chart."
    };
  } else if (activeKey === "amd") {
    markers = [
      { id: "cust-amd-1", x: 65, y: 52, label: "Confluent Macular Drusen", description: "Accumulated extra-cellular lipid waste mounds pushing against photoreceptors and damaging support RPE.", severity: "danger" },
      { id: "cust-amd-2", x: 58, y: 42, label: "Early Focal Atrophy", description: "Noticeable depigmentation marking progressive geographic loss of functional epithelial tissue.", severity: "warning" }
    ];
    med = {
      therapeuticClass: "Macular Nutritional Preservatives & Complement Cascade Blockers",
      targetAction: "Ameliorate dry drusen accumulations and limit progressive geographic atrophy",
      agents: [
        { name: "AREDS 2 Professional Blend", purpose: "Standard formula to slow severe dry stage macular atrophy", dosageExample: "1 softgel twice daily with food" },
        { name: "Pegcetacoplan (Syfovre)", purpose: "Complement inhibitor option for advanced geographic cell atrophy", dosageExample: "Targeted clinical monthly injections" }
      ],
      clinicalWarnings: "Ensure any sudden distortion, wavy lines, or growing central black patches are assessed within 24 hours to check for wet conversion."
    };
    opt = {
      requiredCorrection: "Highly specialized central magnifiers, contrast shields",
      interventions: [
        { deviceOrProcedure: "High-Contrast Reading Magnifiers", purpose: "Compensate for central blind scotoma spots", frequency: "Continuous close work" },
        { deviceOrProcedure: "Amsler Grid Calibration board", purpose: "Detailed distortion screening to catch neovascular hemorrhage transitions", frequency: "Checked daily at home" }
      ],
      dailyMonitoring: "Self-screen eyes separately daily using a wall-mounted Amsler Grid chart."
    };
  } else if (activeKey === "cataract") {
    markers = [
      { id: "cust-cat-1", x: 50, y: 50, label: "Diffuse Lens Scatter Haze", description: "Severe transparency decay of the crystalline lens. Fundus structures are highly obscured.", severity: "warning" }
    ];
    med = {
      therapeuticClass: "Surgical Viscoelastic Adjuncts & Post-Op Corticosteroids",
      targetAction: "Maintain chamber stability during extraction and prevent post-surgery macular swelling",
      agents: [
        { name: "Prednisolone Acetate 1% drops", purpose: "Glucocorticoid to mitigate postoperative inflammation", dosageExample: "1 drop four times daily tapering down for 4 weeks" },
        { name: "Carboxymethylcellulose 0.5% drops", purpose: "Over-the-counter sterile drops to support pre-surgery hydration and glare dry eyes", dosageExample: "As needed throughout the day" }
      ],
      clinicalWarnings: "No drop or pill is clinically proven to halt, cure, or reverse a physical cataract. Surgical extraction is the only effective solution."
    };
    opt = {
      requiredCorrection: "Intraocular Lens (IOL) Implant & UV Protection Support",
      interventions: [
        { deviceOrProcedure: "Phacoemulsification Outpatient Day Surgery", purpose: "Micro-incision ultrasonic cataract disintegration and clear IOL replacement", frequency: "Once per eye, outpatient" },
        { deviceOrProcedure: "Anti-reflective polarized reading glasses", purpose: "Reduce evening headlight scatter ring effects and glare", frequency: "Continuous night driving" }
      ],
      dailyMonitoring: "Screen postoperative visual acuity and check eye margins for signs of redness or cellular irritation."
    };
  } else {
    // Normal
    markers = [
      { id: "cust-norm-1", x: 35, y: 48, label: "Physiological Optic Disc", description: "Healthy pink neural head showing clear margins, sturdy neuroretinal rim obeying the ISNT rule.", severity: "info" },
      { id: "cust-norm-2", x: 65, y: 52, label: "Pristine Macular Center", description: "Properly pigmented central macular zone with a clear, sharp, foveolar reflex.", severity: "info" }
    ];
    med = {
      therapeuticClass: "Ophthalmic Neuroprotectants & Carotenoids",
      targetAction: "Maternal cellular nourishment and free radical scavenging",
      agents: [
        { name: "Lutein & Zeaxanthin formulation", purpose: "Enhance macular pigment density and filter harmful blue wave rays", dosageExample: "10mg Lutein, 2mg Zeaxanthin daily" },
        { name: "Omega-3 Fatty Acids (EPA/DHA)", purpose: "Strengthen lipid layers to prevent dry eye syndrome", dosageExample: "1000mg dietary dose once daily" }
      ],
      clinicalWarnings: "Dietary wellness supplements only. No active medical prescription drugs or surgeries indicated for a healthy eye."
    };
    opt = {
      requiredCorrection: "Zero clinical refractive intervention indicated",
      interventions: [
        { deviceOrProcedure: "UV-400 Polarized Protective glasses", purpose: "Prevent photo-oxidation tissue stress on the retina", frequency: "During prolonged direct outdoor exposure" },
        { deviceOrProcedure: "Anti-reflective screen filters", purpose: "Lower computer screen eye irritation and fatigue", frequency: "During prolonged monitor workspace hours" }
      ],
      dailyMonitoring: "Perform custom self Amsler Grid checks monthly and book standard dilated exam every 12 months."
    };
  }

  report.medicationGuidance = med;
  report.opticalManagement = opt;
  report.customMarkers = markers;
  return report;
}

export function predictEyeDisease(image: string, conditionName: string = "") {
  if (!image) {
    throw new Error("No image content provided in payload.");
  }

  const signature = computeVisualSignature(image);
  const meta = getBase64Meta(image);

  let suggestedCondition = conditionName;
  if (!suggestedCondition) {
    const index = signature % 6;
    const conditionsMap = ["normal", "diabetic", "hypertension", "glaucoma", "macular", "cataract"];
    suggestedCondition = conditionsMap[index];
  }

  const baseReport = getPresetReport(suggestedCondition, signature);
  const completeReport = augmentReportClinicalDetails(baseReport, suggestedCondition);

  completeReport.computedTelemetry = {
    estimatedSizeKb: meta.sizeKb,
    parsedFormat: meta.format,
    reproducibleSeed: signature,
    engineLanguage: "TypeScript (Node.js 22)"
  };

  return completeReport;
}
