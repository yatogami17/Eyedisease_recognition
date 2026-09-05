import express from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 retinal fundus images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Sample clinical predictions fallback database for seamless UX
const SYSTEM_PROMPT = `You are an expert ophthalmic artificial intelligence system designed to screen retinal fundus screening images.
Your objective is to provide professional-grade, preliminary screening evaluation for key ophthalmic conditions:
1. Diabetic Retinopathy (DR)
2. Glaucoma
3. Age-related Macular Degeneration (AMD)
4. Cataract (visualized via hazy media)
5. Normal / Healthy retina

Verify if the image is a retinal fundus photograph (it typically shows a reddish/orange circular view of the retina, blood vessels, optic disc, and macula).
If the image is NOT a retinal fundus photograph:
- Set 'primaryDiagnosis' to 'Invalid Image Type'
- Set 'confidence' to 0
- Set 'riskScore' to 0
- Set 'status' to 'Normal'
- Set 'detailedAnalysis' to 'The uploaded image does not appear to be a retinal fundus photograph. Please upload a clear retinal fundus photo containing key landmarks like the optic nerve, arcade vessels, or macula for automated evaluation.'
- Clear other parameters or add informative placeholders.

If it IS a valid retinal fundus image, perform a comprehensive inspection and return data in the requested JSON structure. Provide specialized notes, confidence percentages, risk score rating, and an outline of findings in anatomical segments.

Disclaimer: Always end or include a clear note that this is an AI screening tool, not a diagnostic medical device, and the user must consult an ophthalmologist for a definitive diagnosis.`;

// Local High-Fidelity Simulated Analysis database for reliable offline and error fallback configurations
function getSimulatedAnalysis(conditionName: string = "") {
  const condition = conditionName ? conditionName.toLowerCase() : "unknown";
  
  if (condition.includes("normal") || condition.includes("healthy")) {
    return {
      primaryDiagnosis: "Healthy Retinal Fundus",
      confidence: 96,
      status: "Normal",
      riskScore: 8,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 2, description: "No microaneurysms, hemorrhages, or exudates observed. Retinal vessels are intact." },
        { name: "Glaucoma", probability: 4, description: "Optic cup-to-disc ratio is within healthy limits (approx 0.3). Clear neuroretinal rim." },
        { name: "Macular Degeneration", probability: 3, description: "Macular pigment density is stable. Foveal reflex is normal. No drusen detected." },
        { name: "Cataract", probability: 1, description: "Media clarity is optimal. No sign of opacity or haze in fundus depiction." },
        { name: "Normal / Healthy Retina", probability: 96, description: "Excellent anatomical presentation. All major landmarks appear healthy." }
      ],
      anatomicalFindings: {
        opticDisc: "Sharp margins, healthy coloring. Optic cup-to-disc ratio is evaluated around 0.3, indicating standard physiological configuration.",
        macula: "Well-centered, normal foveal reflex. Free from exudative changes, macular drusen, pigmentary alterations, or signs of choroidal neovascularization.",
        vasculature: "Retinal vasculature exhibits healthy branching pattern, caliber, and path. Arteriole-to-venule ratio is a normal 2:3. No signs of crossing changes or microaneurysms.",
        retinalBackground: "Homogeneous orange-red background with no pigment anomalies, flame hemorrhages, hard/soft exudates, or cotton wool spots."
      },
      detailedAnalysis: "The screening indicates a healthy retinal representation. Optic disc margins are pristine with normal physiologic cupping. The retinal background shows standard vascularity with zero signs of microaneurysms, neo-vascularization, or drusen. The macula and foveal reflex are normal.",
      recommendations: [
        "Maintain your routine annual eye examination with an ophthalmologist or optometrist.",
        "Protect your eyes from UV rays by wearing sunglasses with high UV protection.",
        "Maintain a balanced diet rich in leafy green vegetables, lutein, and omega-3 fatty acids for ongoing macular health."
      ]
    };
  } else if (condition.includes("diabetic") || condition.includes("retinopathy")) {
    return {
      primaryDiagnosis: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
      confidence: 92,
      status: "Warning",
      riskScore: 78,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 92, description: "Multiple microaneurysms, intraretinal hemorrhages, and extensive hard exudates in the macular arcade." },
        { name: "Glaucoma", probability: 8, description: "Optic nerve and cupping appear stable, but diabetic changes require close monitoring." },
        { name: "Macular Degeneration", probability: 12, description: "Presence of macular edema secondary to diabetic complications is possible." },
        { name: "Cataract", probability: 15, description: "A slightly blurry background representation might suggest minor secondary cataract progression, common in diabetic systems." },
        { name: "Normal / Healthy Retina", probability: 5, description: "Anomalies detected negate general physiological classification." }
      ],
      anatomicalFindings: {
        opticDisc: "Margins are sharp with general pinkish color. No significant pathological cupping is detected at this time.",
        macula: "Exhibits microaneurysms and cluster of hard exudates. Risk of Clinically Significant Macular Edema (CSME) is elevated, warranting optical coherence tomography (OCT) testing.",
        vasculature: "Vessels display localized dilation, tortuosity, and several dot-and-blot hemorrhages. Some arteriole narrowing is noted.",
        retinalBackground: "Multiple petechial and blot hemorrhages across several quadrants. Scattered hard lipid exudates formed in a circinate pattern near the macular zone."
      },
      detailedAnalysis: "This screening scan displays classic visual biomarkers of moderate to severe Diabetic Retinopathy. Multiple scattered dot-and-blot hemorrhages together with lipid hard exudate clusters are visible in the peripheral quadrants and extending towards the macula. Immediate clinical evaluation is suggested to prevent progression to Proliferative Diabetic Retinopathy (PDR) or severe macular edema.",
      recommendations: [
        "Arrange an urgent diagnostic evaluation with an ophthalmologist or a retina specialist within 2-4 weeks.",
        "Consult with your primary healthcare provider to monitor, optimize, and maintain tight control of your blood glucose levels (HbA1c) and blood pressure.",
        "Request a macular Optical Coherence Tomography (OCT) scan to scan for diabetic macular edema (DME)."
      ]
    };
  } else if (condition.includes("glaucoma") || condition.includes("cup")) {
    return {
      primaryDiagnosis: "Suspected Glaucoma (Primary Open-Angle)",
      confidence: 89,
      status: "Urgent",
      riskScore: 82,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 6, description: "Vascular patterns appear within normal parameters." },
        { name: "Glaucoma", probability: 89, description: "Enlarged optic cup-to-disc ratio (CDR ~0.75) with nasal shifting of vessels and focal thinning of the neuroretinal rim." },
        { name: "Macular Degeneration", probability: 5, description: "Macular architecture appears unaffected by primary glaucomatous neuropathy." },
        { name: "Cataract", probability: 10, description: "Mild ocular media opacity is within normal aged limits." },
        { name: "Normal / Healthy Retina", probability: 11, description: "Significant expansion of vertical cupping precludes normal diagnosis." }
      ],
      anatomicalFindings: {
        opticDisc: "Markedly enlarged optic cup. Vertical cup-to-disc ratio is estimated at 0.75-0.8. Thinning of the neuroretinal rim is observable, especially in the inferior and superior regions (disobeying ISNT rule).",
        macula: "Healthy overall structure, clean foveal reflex. Free from exudative changes.",
        vasculature: "Standard vasculature caliber, but visible bayoneting and nasal deviation of the primary central retinal vessels at the optic disc margin, typical of glaucomatous excavation.",
        retinalBackground: "Generally clean background. Mild localized retinal nerve fiber layer (RNFL) bundle defects can be observed radiating from the poles of the optic disc."
      },
      detailedAnalysis: "The screening demonstrates significant optic nerve cupping, suggesting high likelihood of advanced or moderate open-angle glaucoma. The calculated vertical cup-to-disc ratio is approximately 0.78, indicating loss of neuroretinal rim tissue. Retinal vessel bayoneting is present at the cup border. Ocular pressure testing (tonometry) and standard visual fields are essential.",
      recommendations: [
        "Schedule an evaluation with an ophthalmologist or specialized glaucoma clinician as soon as possible.",
        "Undergo Goldmann Applanation Tonometry (GAT) to measure intraocular pressure (IOP).",
        "Ensure secondary diagnostic procedures are scheduled, including visual field perimeter charts (Humphrey Visual Field) and a retinal nerve fiber layer (RNFL) OCT."
      ]
    };
  } else if (condition.includes("macular") || condition.includes("amd") || condition.includes("drusen")) {
    return {
      primaryDiagnosis: "Dry Age-Related Macular Degeneration (AMD) - Moderate Stage",
      confidence: 91,
      status: "Warning",
      riskScore: 70,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 4, description: "Vasculature structure is continuous, no standard diabetic signs." },
        { name: "Glaucoma", probability: 9, description: "Optic nerve and cupping appear consistent with standard parameters." },
        { name: "Macular Degeneration", probability: 91, description: "Numerous medium-to-large soft drusen clustered in the macular region with focal pigment irregularities." },
        { name: "Cataract", probability: 18, description: "General clarity is overall stable with age-related changes." },
        { name: "Normal / Healthy Retina", probability: 9, description: "Presence of macular lesions indicates significant degenerative disease." }
      ],
      anatomicalFindings: {
        opticDisc: "Uniform margins, standard color. Cup-to-disc ratio is normal (approx 0.35).",
        macula: "Highly affected. Exhibits extensive deposits of soft drusen (yellow extracellular matrix aggregates) underneath the retina. Areas of hyperpigmentation and geographic changes of the retinal pigment epithelium (RPE) are visible.",
        vasculature: "General sclerosis of retinal vessels congruent with advanced age, but no neovascular leakage or active hemorrhages detected.",
        retinalBackground: "Clean background outside the central 15-degree macular field."
      },
      detailedAnalysis: "Fundus screening shows distinct biomarkers of dry Age-Related Macular Degeneration (AMD). Multiple soft, confluent drusen are centered in the macula, causing structural deformation of the overlying retina. Ophthalmoscopy indicates focal pigment changes without signs of subretinal fluid or active neovascular bleeding (wet AMD). Daily self-monitoring using the Amsler Grid is indicated.",
      recommendations: [
        "Consult an eye specialist (retinal expert) for regular clinical monitoring.",
        "Perform daily self-checks using an Amsler Grid to monitor for any sudden distortion, wavy lines, or gray spots in your central vision.",
        "Discuss taking Age-Related Eye Disease Study 2 (AREDS2) standard formulation supplements (Vitamin C, E, Zinc, Copper, Lutein, Zeaxanthin) with your doctor to help slow progression."
      ]
    };
  } else if (condition.includes("cataract") || condition.includes("hazy") || condition.includes("obscure")) {
    return {
      primaryDiagnosis: "Ocular Media Opacity - Consistent with Advanced Cataract",
      confidence: 85,
      status: "Warning",
      riskScore: 62,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 15, description: "Detailed screening is impaired due to generalized image blurring." },
        { name: "Glaucoma", probability: 18, description: "Cup margins are partially obscured by optical haze." },
        { name: "Macular Degeneration", probability: 14, description: "Detailed macular evaluation is limited by scattering of input light." },
        { name: "Cataract", probability: 85, description: "Significant attenuation and scatter of light across the entire fundus view, typical of nuclear or cortical lens opacification." },
        { name: "Normal / Healthy Retina", probability: 15, description: "Visual haze impedes identification of standard retinal detail." }
      ],
      anatomicalFindings: {
        opticDisc: "Hazy outline visible. Margins cannot be perfectly resolved but appear structurally intact.",
        macula: "Foveal reflex is muted or absent due to light diffusion through the lens opacity.",
        vasculature: "Vessel tracks are visible as blurred, low-contrast passages. Branching structures are detectable but lack fine detail.",
        retinalBackground: "Displays a uniform washed-out Orange/Muted-red reflex with zero localized hemorrhagic structures resolving."
      },
      detailedAnalysis: "The screening shows generalized, substantial blurring and loss of high-frequency detail throughout the retinal fundus image. There is no indicating digital artifact, suggestively confirming severe media opacity commonly associated with nuclear sclerosis or dense cataract development. Direct visualization of the lens structure is required to confirm.",
      recommendations: [
        "Consult an optometrist or surgeon to discuss cataract progression and surgical planning if vision is clinically impaired.",
        "Ensure secondary examinations include slit-lamp bio-microscopy to measure nuclear density.",
        "Avoid driving at night or in glare conditions as light scatter through the opacity will severely reduce contrast sensitivity."
      ]
    };
  } else {
    return {
      primaryDiagnosis: "Indeterminate Screening - Retinal landmarks present",
      confidence: 65,
      status: "Warning",
      riskScore: 45,
      conditions: [
        { name: "Diabetic Retinopathy", probability: 10, description: "Inconclusive visual indicators." },
        { name: "Glaucoma", probability: 12, description: "Cupping appears standard but edge contrast is suboptimal." },
        { name: "Macular Degeneration", probability: 11, description: "Central zone exhibits moderate pigmentation." },
        { name: "Cataract", probability: 20, description: "Typical aged clarity." },
        { name: "Normal / Healthy Retina", probability: 65, description: "Overall layout reflects general biological norms." }
      ],
      anatomicalFindings: {
        opticDisc: "Disc outline is visible. Details are generally standard.",
        macula: "The central macular region displays standard appearance without severe drusen accretion.",
        vasculature: "Vessels run standard trajectories, standard caliber.",
        retinalBackground: "Uniform coloration with normal reflectivity."
      },
      detailedAnalysis: "The analyzed scan is moderately clear. No severe abnormalities (such as proliferative diabetic bleeding, hard exudates, or gross optic nerve remodeling) were successfully parsed. However, minor variations might be present.",
      recommendations: [
        "Schedule a periodic complete eye screen with dilation.",
        "Monitor for any sudden changes, floaters, or localized visual field shadows."
      ]
    };
  }
}

// Helper to run diagnostic analysis inside our secure Python 3 subsystem
function runPythonPredictor(image: string, conditionName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log("[Backend python spawner] Launching secure python3 predictor.py subsystem...");
    const pyProcess = spawn("python3", [path.join(process.cwd(), "predictor.py")]);
    
    let stdoutData = "";
    let stderrData = "";
    
    pyProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });
    
    pyProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });
    
    pyProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Python Engine Error] Exit code ${code}: ${stderrData}`);
        return reject(new Error(`Python process exited with code ${code}. Error: ${stderrData}`));
      }
      
      try {
        const parsed = JSON.parse(stdoutData.trim());
        if (parsed.error) {
          return reject(new Error(parsed.message || parsed.error));
        }
        resolve(parsed);
      } catch (parseErr) {
        console.error("[Python Engine Parse Error] Failed to parse stdout:", stdoutData);
        reject(new Error("Failed to parse prediction result from Python engine."));
      }
    });
    
    pyProcess.on("error", (err) => {
      console.error("[Python Process Spawn Error]:", err);
      reject(err);
    });
    
    // Write JSON payload to Python's stdin and end the stream
    const payload = JSON.stringify({ image, conditionName });
    pyProcess.stdin.write(payload);
    pyProcess.stdin.end();
  });
}

// Endpoint for retinal image disease prediction, delegating core logic to Python
app.post("/api/predict", async (req, res) => {
  const { image, conditionName } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image content provided." });
  }

  try {
    console.log("[Clinical Neural Simulator] Delegating fundus feature extraction and classification to Python subsystem...");
    const reportData = await runPythonPredictor(image, conditionName || "");
    console.log(`[Clinical Neural Simulator] Received Python analysis. Primary Diagnosis: '${reportData.primaryDiagnosis}'`);
    return res.json(reportData);
  } catch (error: any) {
    console.error("[Clinical Neural Simulator] Error in Python diagnostic loop:", error);
    return res.status(500).json({
      error: "Error running clinical algorithm inside Python subprocess.",
      message: error?.message || "Internal algorithm runtime error."
    });
  }
});

// Helper to run code plagiarism analyzer inside our secure Python 3 subsystem
function runPythonPlagiarism(codeA: string, codeB: string): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log("[Backend Plagiarism spawner] Launching secure python3 plagiarism_checker.py subsystem...");
    const pyProcess = spawn("python3", [path.join(process.cwd(), "plagiarism_checker.py")]);
    
    let stdoutData = "";
    let stderrData = "";
    
    pyProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });
    
    pyProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });
    
    pyProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Plagiarism Engine Error] Exit code ${code}: ${stderrData}`);
        return reject(new Error(`Python process exited with code ${code}. Error: ${stderrData}`));
      }
      
      try {
        const parsed = JSON.parse(stdoutData.trim());
        if (parsed.error) {
          return reject(new Error(parsed.message || parsed.error));
        }
        resolve(parsed);
      } catch (parseErr) {
        console.error("[Plagiarism Engine Parse Error] Failed to parse stdout:", stdoutData);
        reject(new Error("Failed to parse plagiarism result from Python engine."));
      }
    });
    
    pyProcess.on("error", (err) => {
      console.error("[Plagiarism Process Spawn Error]:", err);
      reject(err);
    });
    
    // Write JSON payload to Python's stdin and end the stream
    const payload = JSON.stringify({ codeA, codeB });
    pyProcess.stdin.write(payload);
    pyProcess.stdin.end();
  });
}

// Endpoint for code plagiarism analysis
app.post("/api/plagiarism-test", async (req, res) => {
  const { codeA, codeB } = req.body;

  if (codeA === undefined || codeB === undefined) {
    return res.status(400).json({ error: "Both codeA and codeB parameters are required." });
  }

  try {
    console.log("[Plagiarism Subsystem] Analyzing code similarities...");
    const results = await runPythonPlagiarism(codeA, codeB);
    return res.json(results);
  } catch (error: any) {
    console.error("[Plagiarism Subsystem] Error running analyzer:", error);
    return res.status(500).json({
      error: "Error running plagiarism checker.",
      message: error?.message || "Internal algorithm runtime error."
    });
  }
});

// Serve static assets and Vite middleware connection
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("[Backend] Setting up Vite middleware in development mode...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteLoadError) {
      console.error("[Backend] Failed to load Vite. Reverting to serving dist folder if present:", viteLoadError);
      const distPath = path.join(process.cwd(), "dist");
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      } else {
        throw viteLoadError;
      }
    }
  } else {
    console.log("[Backend] Serving compiled static assets from /dist in production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend] System activated on port ${PORT} (Ingress 0.0.0.0)`);
  });
}

startServer();
