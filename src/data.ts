import { SampleRetinalImage, SymptomConfig, PlagiarismPreset } from "./types";

export const SAMPLE_IMAGES: SampleRetinalImage[] = [
  {
    id: "sample-normal",
    name: "Normal Healthy Retina",
    conditionKey: "normal",
    clinicalTitle: "Healthy Retinal Fundus (Normal)",
    shortDescription: "A pristine retina showing a clear optic disc, healthy macula, and standard retinal vascular architecture.",
    longClinicalDescription: "Demonstrates healthy physiological parameters. Vertical cup-to-disc ratio is 0.32, within the normal range of 0.3-0.4. The neuroretinal rim is robust and uniform, obeying the ISNT rule (Inferior > Superior > Nasal > Temporal thickness). The macular region is homogeneous with an intact foveal reflex. Retinal vessels radiate uniformly with zero hemorrhages, exudates, or drusen deposits.",
    primaryBgColor: "radial-gradient(circle, #ff6b3d 0%, #d43d1a 60%, #8c1e03 100%)",
    opticMetrics: {
      cupToDiscRatio: 0.32,
      normalThreshold: 0.40,
      isntRuleCompliant: true,
      rimThickness: { inferior: 0.42, superior: 0.38, nasal: 0.31, temporal: 0.24 },
      discDiameterPx: 148,
      cupDiameterPx: 47,
      clinicalAssessment: "Normal physiologic cupping. ISNT rule preserved. Robust neuroretinal rim tissue without glaucomatous excavation."
    },
    vascularMetrics: {
      arterioleToVenuleRatio: 0.67, // Normal 2:3 ratio
      tortuosityIndex: 1.08,
      bifurcationDensity: 3.4,
      avNickingCount: 0,
      copperWiringPresent: false,
      clinicalAssessment: "Pristine vascular caliber, uniform arteriole-to-venule ratio (2:3), smooth arcade trajectories with intact capillary network."
    },
    abnormalities: [
      {
        id: "ab-norm-disc",
        lesionType: "normal_landmark",
        label: "Optic Nerve Head (Normal CDR 0.32)",
        x: 35,
        y: 50,
        width: 14,
        height: 16,
        severity: "info",
        description: "Normal physiologic optic disc with crisp margins and intact pink neuroretinal rim.",
        clinicalSignificance: "Cup-to-Disc ratio 0.32 confirms absence of glaucomatous nerve fiber excavation.",
        confidence: 98.4
      },
      {
        id: "ab-norm-macula",
        lesionType: "normal_landmark",
        label: "Fovea Centralis (Normal)",
        x: 65,
        y: 50,
        width: 12,
        height: 12,
        severity: "info",
        description: "Uniform foveal pit with sharp foveal light reflex. Avascular zone intact.",
        clinicalSignificance: "Absence of macular edema, drusen, or geographic pigment alterations.",
        confidence: 97.9
      }
    ],
    markers: [
      {
        id: "m-norm-1",
        x: 35,
        y: 48,
        label: "Optic Disc (Healthy)",
        description: "The entry point for major blood vessels. It has well-defined edges, a normal vertical cup-to-disc ratio of 0.32, and robust pinkish neuroretinal rim.",
        severity: "info",
        boxWidth: 15,
        boxHeight: 17,
        lesionType: "normal_landmark"
      },
      {
        id: "m-norm-2",
        x: 65,
        y: 52,
        label: "Healthy Macula",
        description: "The highly sensitive central retinal zone responsible for sharp vision. Note the dark pigmentation and fine foveal reflex in the center.",
        severity: "info",
        boxWidth: 13,
        boxHeight: 13,
        lesionType: "normal_landmark"
      },
      {
        id: "m-norm-3",
        x: 48,
        y: 28,
        label: "Main Temporal Arcade",
        description: "Standard branching trajectories of arterioles and venules forming a healthy protective basket layout over the macular poles.",
        severity: "info",
        boxWidth: 18,
        boxHeight: 14,
        lesionType: "normal_landmark"
      }
    ]
  },
  {
    id: "sample-diabetic",
    name: "Diabetic Retinopathy",
    conditionKey: "diabetic",
    clinicalTitle: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
    shortDescription: "Retina displaying microaneurysms, dot-and-blot hemorrhages, and waxy lipoprotein deposits (hard exudates).",
    longClinicalDescription: "Visualizes extensive vascular damage secondary to chronic hyperglycemia. Present are classic lesions: tiny red spots (microaneurysms) representing outpouchings of vessel walls; dark-red circular spots (intraretinal hemorrhages); and yellow, crisp-edged deposits (hard exudates) representing leaked lipids within the deep sensory layers of the retina.",
    primaryBgColor: "radial-gradient(circle, #ff5e3a 0%, #cc3311 50%, #7d1502 100%)",
    opticMetrics: {
      cupToDiscRatio: 0.34,
      normalThreshold: 0.40,
      isntRuleCompliant: true,
      rimThickness: { inferior: 0.40, superior: 0.36, nasal: 0.30, temporal: 0.23 },
      discDiameterPx: 146,
      cupDiameterPx: 50,
      clinicalAssessment: "Optic disc margins preserved. Primary pathology localized to capillary microvascular bed."
    },
    vascularMetrics: {
      arterioleToVenuleRatio: 0.62,
      tortuosityIndex: 1.38,
      bifurcationDensity: 4.8,
      avNickingCount: 1,
      copperWiringPresent: false,
      clinicalAssessment: "Microvascular remodeling, elevated venous beading, loop caliber dilation, and widespread capillary leakage."
    },
    abnormalities: [
      {
        id: "ab-dr-exudates",
        lesionType: "hard_exudate",
        label: "Circinate Hard Exudates",
        x: 54,
        y: 58,
        width: 16,
        height: 14,
        severity: "danger",
        description: "Waxy, lipid-protein deposits from chronic vascular hyperpermeability.",
        clinicalSignificance: "Threatens central vision with diabetic macular edema (DME). Requires prompt OCT and anti-VEGF evaluation.",
        confidence: 96.8
      },
      {
        id: "ab-dr-hemorrhage",
        lesionType: "hemorrhage",
        label: "Intraretinal Dot-and-Blot Hemorrhages",
        x: 68,
        y: 65,
        width: 14,
        height: 12,
        severity: "danger",
        description: "Deep retinal capillary bed rupture presenting as discrete dark-red micro-pools.",
        clinicalSignificance: "Indicative of moderate-to-severe ischemic capillary closure across macular quadrants.",
        confidence: 94.7
      },
      {
        id: "ab-dr-aneurysm",
        lesionType: "microaneurysm",
        label: "Capillary Microaneurysms",
        x: 42,
        y: 35,
        width: 10,
        height: 10,
        severity: "warning",
        description: "Focal capillary wall outpouchings appearing as punctate red spheres.",
        clinicalSignificance: "Earliest definitive clinical biomarker of diabetic microvascular breakdown.",
        confidence: 96.25
      },
      {
        id: "ab-dr-cws",
        lesionType: "cotton_wool_spot",
        label: "Cotton-Wool Spot (Axoplasmic Infarct)",
        x: 71,
        y: 29,
        width: 12,
        height: 12,
        severity: "warning",
        description: "Fluffy whitish patch caused by focal retinal nerve fiber ischemia and axoplasmic stasis.",
        clinicalSignificance: "Marks regional arteriolar occlusion and progression toward proliferative DR.",
        confidence: 93.1
      }
    ],
    markers: [
      {
        id: "m-dr-1",
        x: 54,
        y: 58,
        label: "Lipid Hard Exudates",
        description: "Yellow waxy deposits formed from protein and lipid leakage through damaged capillary walls. Clustered near the macula.",
        severity: "danger",
        boxWidth: 16,
        boxHeight: 14,
        lesionType: "hard_exudate"
      },
      {
        id: "m-dr-2",
        x: 68,
        y: 65,
        label: "Dot Hemorrhage",
        description: "Small ruptured capillaries bleeding into deep retinal layers. Appears as crisp red blots in the extra-macular quadrants.",
        severity: "danger",
        boxWidth: 14,
        boxHeight: 12,
        lesionType: "hemorrhage"
      },
      {
        id: "m-dr-3",
        x: 42,
        y: 35,
        label: "Microaneurysms",
        description: "Tiny micro-ballooning of weak blood vessels. Earliest signs of diabetic retinal damage. Appears as scattered red micro-dots.",
        severity: "warning",
        boxWidth: 10,
        boxHeight: 10,
        lesionType: "microaneurysm"
      }
    ]
  },
  {
    id: "sample-hypertension",
    name: "Hypertensive Retinopathy",
    conditionKey: "hypertension",
    clinicalTitle: "Grade III Hypertensive Retinopathy with AV Nicking",
    shortDescription: "Retinal scan exhibiting severe arteriolar narrowing, copper-wiring light reflex, arteriovenous nicking, and flame hemorrhages.",
    longClinicalDescription: "Visualizes severe retinal microvascular modifications precipitated by sustained chronic arterial hypertension. Crucial biomarkers include generalized and focal arteriolar constriction (A/V ratio reduced to 1:3), enhanced reflex stripe giving the arterioles a burnished 'copper-wire' sheen, Salus and Gunn signs (arteriovenous nicking where thickened arterioles compress intersecting venules), and linear flame-shaped hemorrhages within the nerve fiber bundle layer.",
    primaryBgColor: "radial-gradient(circle, #ff6347 0%, #c92a10 55%, #7a1200 100%)",
    opticMetrics: {
      cupToDiscRatio: 0.35,
      normalThreshold: 0.40,
      isntRuleCompliant: true,
      rimThickness: { inferior: 0.38, superior: 0.35, nasal: 0.28, temporal: 0.22 },
      discDiameterPx: 147,
      cupDiameterPx: 51,
      clinicalAssessment: "Slight disc hyperemia secondary to acute arterial perfusion pressure; no papilledema (Grade IV)."
    },
    vascularMetrics: {
      arterioleToVenuleRatio: 0.33, // Severely constricted 1:3 ratio
      tortuosityIndex: 1.45,
      bifurcationDensity: 3.1,
      avNickingCount: 4,
      copperWiringPresent: true,
      clinicalAssessment: "Marked generalized arteriolar attenuation, significant Salus/Gunn AV crossing changes, and copper-wiring sclerosis."
    },
    abnormalities: [
      {
        id: "ab-htn-nicking",
        lesionType: "av_nicking",
        label: "Arteriovenous (AV) Nicking (Salus Sign)",
        x: 48,
        y: 32,
        width: 14,
        height: 12,
        severity: "danger",
        description: "Hardened arteriole crossing compresses and indents underlying venule.",
        clinicalSignificance: "Direct vascular evidence of long-standing systemic hypertension and elevated stroke risk.",
        confidence: 95.8
      },
      {
        id: "ab-htn-copper",
        lesionType: "copper_wiring",
        label: "Copper-Wiring Reflex",
        x: 62,
        y: 44,
        width: 15,
        height: 10,
        severity: "warning",
        description: "Arteriolar wall hypertrophy and hyalinization produces a broad, lustrous copper reflex.",
        clinicalSignificance: "Signifies Grade II/III arteriolosclerosis secondary to prolonged elevated blood pressure.",
        confidence: 94.2
      },
      {
        id: "ab-htn-flame",
        lesionType: "hemorrhage",
        label: "Superficial Flame Hemorrhage",
        x: 58,
        y: 62,
        width: 18,
        height: 12,
        severity: "danger",
        description: "Splinter-shaped blood leakage tracking along the parallel nerve fiber bundle layer.",
        clinicalSignificance: "Indicates acute capillary pressure decompensation requiring urgent hypertensive therapy.",
        confidence: 95.1
      }
    ],
    markers: [
      {
        id: "m-htn-1",
        x: 48,
        y: 32,
        label: "Arteriovenous (AV) Nicking",
        description: "Salus sign: crossing sclerotic arteriole indents and displaces the venule under severe localized pressure.",
        severity: "danger",
        boxWidth: 14,
        boxHeight: 12,
        lesionType: "av_nicking"
      },
      {
        id: "m-htn-2",
        x: 62,
        y: 44,
        label: "Copper Wiring Reflex",
        description: "Thickened arteriolar muscular wall reflects light with a distinctive burnished copper appearance.",
        severity: "warning",
        boxWidth: 15,
        boxHeight: 10,
        lesionType: "copper_wiring"
      },
      {
        id: "m-htn-3",
        x: 58,
        y: 62,
        label: "Flame Hemorrhage",
        description: "Linear superficial hemorrhage aligned with the axonal trajectory of the nerve fiber layer.",
        severity: "danger",
        boxWidth: 18,
        boxHeight: 12,
        lesionType: "hemorrhage"
      }
    ]
  },
  {
    id: "sample-glaucoma",
    name: "Glaucomatous Neuropathy",
    conditionKey: "glaucoma",
    clinicalTitle: "Suspected Advanced Open-Angle Glaucoma",
    shortDescription: "Retina focusing on the optic disc showing major excavation (cupping) due to high intraocular pressure and retinal nerve fiber loss.",
    longClinicalDescription: "Exhibits advanced glaucomatous remodeling of the optic nerve head. The central pale cup is severely enlarged, prompting a vertical cup-to-disc ratio of 0.78. The pink neuroretinal rim is critically thinned superiorly and inferiorly. Notice key vascular cues: 'bayoneting' (vessels bending sharply at the rim edge) and 'nasalization' (primary vessels pushed to the inner side).",
    primaryBgColor: "radial-gradient(circle, #f58442 0%, #c44d18 60%, #7d1d02 100%)",
    opticMetrics: {
      cupToDiscRatio: 0.78, // Severe glaucomatous excavation
      normalThreshold: 0.40,
      isntRuleCompliant: false, // VIOLATED ISNT rule: inferior and superior rim critically lost
      rimThickness: { inferior: 0.12, superior: 0.14, nasal: 0.29, temporal: 0.11 },
      discDiameterPx: 152,
      cupDiameterPx: 118,
      clinicalAssessment: "CRITICAL ALERT: Vertical CDR of 0.78 exceeds safety threshold. Severe violation of ISNT rule due to inferior and superior neuroretinal rim thinning. Bayoneting of arcade vessels."
    },
    vascularMetrics: {
      arterioleToVenuleRatio: 0.65,
      tortuosityIndex: 1.12,
      bifurcationDensity: 3.2,
      avNickingCount: 0,
      copperWiringPresent: false,
      clinicalAssessment: "Marked nasal displacement (nasalization) and sharp 90-degree vessel step (bayoneting) at the steep optic cup margin."
    },
    abnormalities: [
      {
        id: "ab-glau-cupping",
        lesionType: "optic_cupping",
        label: "Severe Optic Cup Excavation (CDR 0.78)",
        x: 35,
        y: 50,
        width: 18,
        height: 20,
        severity: "danger",
        description: "Pale central depression occupying 78% of the optic disc vertical height.",
        clinicalSignificance: "High likelihood of irreversibly damaged retinal ganglion cell axons and peripheral visual field loss.",
        confidence: 96.5
      },
      {
        id: "ab-glau-rim",
        lesionType: "rim_thinning",
        label: "Neuroretinal Rim Thinning (ISNT Violation)",
        x: 35,
        y: 40,
        width: 16,
        height: 8,
        severity: "danger",
        description: "Focal notching and extreme thinning of the superior and inferior functional neuroretinal rim.",
        clinicalSignificance: "Correlates directly with Arcuate and Bjerrum scotomas in automated Humphrey visual field perimetry.",
        confidence: 95.8
      },
      {
        id: "ab-glau-bayonet",
        lesionType: "optic_cupping",
        label: "Vessel Bayoneting & Nasalization",
        x: 38,
        y: 56,
        width: 12,
        height: 10,
        severity: "warning",
        description: "Central vessels make a sharp double-bend over the excavated cup margin.",
        clinicalSignificance: "Classic geometric hallmark of advanced lamina cribrosa compression and tissue loss.",
        confidence: 94.3
      }
    ],
    markers: [
      {
        id: "m-glau-1",
        x: 35,
        y: 50,
        label: "Significantly Enlarged Optic Cup",
        description: "The pale, white center has expanded dramatically to 78% (Cup-to-Disc Ratio of 0.78) due to localized nerve cell apoptosis.",
        severity: "danger",
        boxWidth: 18,
        boxHeight: 20,
        lesionType: "optic_cupping"
      },
      {
        id: "m-glau-2",
        x: 35,
        y: 40,
        label: "Rim Thinning (Loss of Nerve Fibers)",
        description: "Crucial structural deterioration of the neuroretinal rim. Note the extreme pallor and narrow width of the pink functional rim.",
        severity: "danger",
        boxWidth: 16,
        boxHeight: 8,
        lesionType: "rim_thinning"
      },
      {
        id: "m-glau-3",
        x: 38,
        y: 56,
        label: "Nasalized Vessel Branch",
        description: "Major central retinal vessels are compressed and pushed toward the nasal margins of the disc, characteristic of optic nerve excavation.",
        severity: "warning",
        boxWidth: 12,
        boxHeight: 10,
        lesionType: "optic_cupping"
      }
    ]
  },
  {
    id: "sample-amd",
    name: "Macular Degeneration",
    conditionKey: "amd",
    clinicalTitle: "Dry Age-Related Macular Degeneration (AMD)",
    shortDescription: "Retina highlighting central macular region heavily loaded with soft yellow metabolic waste deposits (drusen).",
    longClinicalDescription: "DemonstratesDry AMD changes localized within the macula. Numerous soft, medium-to-large pale yellow drusen are clustered together. These confluent drusen deform the sensory cells, leading to localized atrophy of the Retinal Pigment Epithelium (RPE) and photoreceptors. High risk of central vision distortion without current neovascular bleeding.",
    primaryBgColor: "radial-gradient(circle, #e8733c 0%, #b84318 60%, #751a02 100%)",
    markers: [
      {
        id: "m-amd-1",
        x: 65,
        y: 52,
        label: "Confluent Soft Drusen",
        description: "Clustered, cloudy yellow spots centering the macula. These represent accumulated extracellular metabolic waste under the sensory cell layers.",
        severity: "danger"
      },
      {
        id: "m-amd-2",
        x: 58,
        y: 45,
        label: "Focal RPE Alteration",
        description: "Slight hyperpigmentation and local deterioration of the epithelial tissue, signaling early progressive geographic cell loss.",
        severity: "warning"
      },
      {
        id: "m-amd-3",
        x: 35,
        y: 48,
        label: "Unaffected Optic Nerve",
        description: "For comparative diagnostic purposes, the optic nerve preserves regular cup-to-disc margins, showing AMD is isolated to the central macular field.",
        severity: "info"
      }
    ]
  },
  {
    id: "sample-cataract",
    name: "Advanced Cataract View",
    conditionKey: "cataract",
    clinicalTitle: "Hazy Fundus View secondary to Nuclear Cataract",
    shortDescription: "An overall dim, blurry, and low-contrast fundus view caused by the light-scattering effect of a matured clouding lens.",
    longClinicalDescription: "The fundus photograph demonstrates severe loss of focus and optical contrast. While the anatomical structures are structurally intact, the light emitted is scattered and attenuated through the patient's opacified crystalline lens (cataract). This haziness mimics media opacity, forcing a muted backdrop with zero fine details visible in vessels or nerve borders.",
    primaryBgColor: "radial-gradient(circle, #bd7055 0%, #8f4b36 40%, #521c0e 100%)",
    markers: [
      {
        id: "m-cat-1",
        x: 50,
        y: 50,
        label: "Generalized Haze-Induced Blurring",
        description: "Entire retinal scene lacks focus due to progressive optical turbidity. Diagnostic visual evaluation is restricted.",
        severity: "warning"
      },
      {
        id: "m-cat-2",
        x: 35,
        y: 48,
        label: "Muted Optic Disc Border",
        description: "The sharp margins of the optic disc are entirely diffused. Contrast borders are heavily lowered by lens opacification.",
        severity: "warning"
      },
      {
        id: "m-cat-3",
        x: 65,
        y: 52,
        label: "Dimmed Foveal Reflex",
        description: "The characteristic light-bounce point of the healthy macula is undetectable due to extreme scatter of incoming scanner light.",
        severity: "info"
      }
    ]
  }
];

export const SYMPTOMS: SymptomConfig[] = [
  {
    id: "s-blur",
    label: "Blurry or fuzzy central vision",
    description: "Difficulty reading, recognizing faces, or seeing small details in front of you.",
    severity: "medium",
    matchedConditions: ["Diabetic Retinopathy", "Macular Degeneration", "Cataract"]
  },
  {
    id: "s-lines",
    label: "Straight lines look wavy or bent",
    description: "Grid lines, door frames, or columns appear distorted (metamorphopsia). Classic sign of macular disease.",
    severity: "high",
    matchedConditions: ["Macular Degeneration", "Diabetic Retinopathy"]
  },
  {
    id: "s-blind",
    label: "A dark patch or empty spot in central vision",
    description: "A dark blind spot (scotoma) right in the center of where you look.",
    severity: "high",
    matchedConditions: ["Macular Degeneration"]
  },
  {
    id: "s-periph",
    label: "Gradual loss of peripheral (side) vision",
    description: "Tunnel vision context. Having problems noticing moving items on the side.",
    severity: "high",
    matchedConditions: ["Glaucoma"]
  },
  {
    id: "s-float",
    label: "Dark spots, strings, or 'floaters' in vision",
    description: "Seeing small moving spots, webs, or shapes that dance across your vision field.",
    severity: "medium",
    matchedConditions: ["Diabetic Retinopathy"]
  },
  {
    id: "s-night",
    label: "Poor night vision or need for extra bright light",
    description: "Increased difficulty navigating in dim light and seeing outline contrast.",
    severity: "low",
    matchedConditions: ["Cataract", "Glaucoma"]
  },
  {
    id: "s-glare",
    label: "Halos around lights & glare sensitivity",
    description: "Bright lights look scattered, with uncomfortable glares or circular rims.",
    severity: "low",
    matchedConditions: ["Cataract"]
  }
];

export const EDUCATION_MATERIAL = {
  anatomicalBreakdown: [
    {
      title: "Optic Nerve Head (Optic Disc)",
      desc: "The 'cable link' connecting the eye to the brain. In glaucoma, high ocular pressure leads to the loss of nerve fibers, causing the cup (the center yellow pit) to grow larger, a process called 'cupping'. Margins should be sharp and distinct.",
      tips: "Essential metrics: Cup-to-Disc Ratio (healthy is <= 0.4)."
    },
    {
      title: "Macula & Fovea",
      desc: "The focal point of central vision. It allows us to read, drive, and resolve detailed features. It requires pristine blood supply. Drusen accumulation here or capillary leakage leads to blurred central sight.",
      tips: "Protected by lutein and direct dietary pigments."
    },
    {
      title: "Retinal Blood Vasculature",
      desc: "A rich network of veins and arteries. The retina is highly sensitive to chronic metabolic conditions like diabetes. High blood sugar damages these tiny capillaries, resulting in fluid leakage, bleeding, or closure.",
      tips: "Pathologies include microaneurysms and hard exudates."
    }
  ],
  preventionTips: [
    {
      title: "Schedule Comprehensive Dilated Eye Exams",
      text: "Many severe eye diseases like glaucoma can progress silently, destroying up to 40% of physical optic nerve sight before any symptoms occur. Dilated exams allow direct inspection of deep clinical tissue."
    },
    {
      title: "Control Metabolic Metrics (HbA1c & Blood Pressure)",
      text: "For diabetic patients, controlling glycosylated hemoglobin (HbA1c) and arterial pressure significantly lowers the progression and development rate of diabetic retinopathy."
    },
    {
      title: "UV Protection and Healthy Micronutrients",
      text: "Wear sunglasses shielding 99% of UVA/UVB light. Focus on AREDS2-recommended micronutrients like lutein, zeaxanthin, zinc, and omega-3 oils to ward off early dry macular progression."
    }
  ]
};

export const PLAGIARISM_PRESETS: PlagiarismPreset[] = [
  {
    id: "preset-1percent",
    name: "1% Plagiarism Match (Common Boilerplate)",
    expectedScore: "1.0%",
    description: "Two completely different algorithms (Binary Search Tree vs. QuickSort) that happen to share a single short debug or helper function print line. This represents natural, non-plagiarized accidental syntax overlap.",
    codeA: `# Binary Search Tree Node definition and search logic
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if root.val == key:
            return root
        elif root.val < key:
            root.right = insert(root.right, key)
        else:
            root.left = insert(root.left, key)
    return root

def search_bst(root, key):
    if root is None or root.val == key:
        return root
    if root.val < key:
        return search_bst(root.right, key)
    return search_bst(root.left, key)

# Helper function for execution trace
def print_tree_diagnostic_report():
    print("BST diagnostics complete.")`,
    codeB: `# QuickSort array sorting implementation
def quick_sort_partition(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort_partition(left) + middle + quick_sort_partition(right)

# Helper function for execution trace
def print_tree_diagnostic_report():
    print("BST diagnostics complete.")`
  },
  {
    id: "preset-45percent",
    name: "45% Plagiarism Match (Variable Refactoring)",
    expectedScore: "45.0%",
    description: "The underlying logic is identical, but the suspect code has modified loop counters, stripped functional comments, and renamed parameters (e.g. 'limit' to 'threshold') to evade detection.",
    codeA: `def calculate_fibonacci_sequence(limit):
    # Generates a Fibonacci list up to the specified limit threshold
    if limit <= 0:
        return []
    elif limit == 1:
        return [0]
        
    sequence = [0, 1]
    while len(sequence) < limit:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
        
    # Print telemetry logging
    print("Calculation finished successfully.")
    return sequence, sum(sequence), len(sequence) # returns tuple`,
    codeB: `def generate_sequence(threshold):
    if threshold <= 0:
        return []
    elif threshold == 1:
        return [0]
        
    vals = [0, 1]
    while len(vals) < threshold:
        next_num = vals[-1] + vals[-2]
        vals.append(next_num)
        
    print("Calculation finished successfully.")
    return vals, sum(vals), len(vals)`
  },
  {
    id: "preset-98percent",
    name: "98% Plagiarism Match (Direct Copy-Paste)",
    expectedScore: "98.5%",
    description: "An exact, block-by-block duplicate of a complex custom implementation. Only the header author name or documentation strings were slightly modified, which triggers a critical alert.",
    codeA: `# Author: Dr. Robert S. Vance, Ophthalmic Lab
# Specialized Matrix multiplication for retinal grid scanning
def multiply_retinal_grids(grid_a, grid_b):
    if len(grid_a[0]) != len(grid_b):
        raise ValueError("Incompatible dimensions for grid multiplication.")
        
    result = [[0 for _ in range(len(grid_b[0]))] for _ in range(len(grid_a))]
    
    # Standard matrix multiplication loops
    for i in range(len(grid_a)):
        for j in range(len(grid_b[0])):
            for k in range(len(grid_b)):
                result[i][j] += grid_a[i][k] * grid_b[k][j]
                
    print("[LOG] Matrix operation finished.")
    return result`,
    codeB: `# Author: Dr. Marcus Sterling, Independent Lab
# Specialized Matrix multiplication for retinal grid scanning
def multiply_retinal_grids(grid_a, grid_b):
    if len(grid_a[0]) != len(grid_b):
        raise ValueError("Incompatible dimensions for grid multiplication.")
        
    result = [[0 for _ in range(len(grid_b[0]))] for _ in range(len(grid_a))]
    
    # Standard matrix multiplication loops
    for i in range(len(grid_a)):
        for j in range(len(grid_b[0])):
            for k in range(len(grid_b)):
                result[i][j] += grid_a[i][k] * grid_b[k][j]
                
    print("[LOG] Matrix operation complete.")
    return result`
  },
  {
    id: "preset-0percent",
    name: "0% Plagiarism Match (Fully Original)",
    expectedScore: "0.0%",
    description: "Two entirely unique programs written in different syntaxes (Python web crawler vs. TypeScript math helper). No overlap exists.",
    codeA: `# Python simple web crawler helper
import urllib.request
import re

def grab_title_from_url(url):
    try:
        response = urllib.request.urlopen(url, timeout=5)
        html = response.read().decode('utf-8')
        title_match = re.search('<title>(.*?)</title>', html, re.IGNORECASE)
        return title_match.group(1) if title_match else "No Title Found"
    except Exception as e:
        return f"Fetch error: {str(e)}"`,
    codeB: `// TypeScript coordinate transformation helper
export function translateGridCoordinates(x: number, y: number, offset: number): { nx: number; ny: number } {
  const theta = (offset * Math.PI) / 180;
  const nx = x * Math.cos(theta) - y * Math.sin(theta);
  const ny = x * Math.sin(theta) + y * Math.cos(theta);
  return { nx: Math.round(nx), ny: Math.round(ny) };
}`
  },
];

export const IJIRCCE_PAPER = {
  title: "AI-Based Disease Prediction Using Retinal Images",
  journal: "International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE)",
  journalShort: "IJIRCCE",
  issnOnline: "2320-9801",
  issnPrint: "2320-9798",
  impactFactor: "8.771 (ESTD: 2013 | UGC CARE Approved)",
  volume: "Volume 14, Issue 6, June 2026 (Vol 185)",
  pageRange: "5504 – 5509",
  doi: "10.15680/IJIRCCE.2026.14060104",
  articleUrl: "https://ijircce.com/article/ai-based-disease-prediction-using-retinal-images-19492#2026",
  pdfPath: "pdf/104_AI-Based Disease Prediction Using Retinal Images.pdf",
  authors: [
    {
      name: "V.V. Nikaas",
      designation: "PG Scholar, Department of Master of Computer Applications (MCA)",
      institution: "R.V.S. College of Engineering, Dindigul, Tamil Nadu, India"
    },
    {
      name: "C. Vanessa",
      designation: "Assistant Professor, Department of Master of Computer Applications (MCA)",
      institution: "R.V.S. College of Engineering, Dindigul, Tamil Nadu, India"
    }
  ],
  keywords: [
    "Artificial Intelligence (AI)",
    "Retinal Image Analysis",
    "Convolutional Neural Network (CNN)",
    "Disease Prediction",
    "Fundus Imaging",
    "Deep Learning",
    "Medical Image Processing",
    "Diabetic Retinopathy",
    "Hypertension Retinopathy",
    "Glaucoma"
  ],
  abstract:
    "This project presents an AI-driven disease prediction system using retinal biomarkers and deep learning techniques for early disease detection. Retinal fundus images are analyzed to identify diseases such as diabetes, hypertension, cardiovascular, and neurological disorders. To overcome these limitations, the proposed system uses a Convolutional Neural Network (CNN) for automated disease detection and retinal abnormality analysis. Image preprocessing techniques such as normalization, noise reduction, and contrast enhancement improve image quality and model performance. Overall, the system promotes preventive healthcare through non-invasive retinal imaging and early disease identification.",
  modules: [
    {
      num: 1,
      title: "Image Upload Module",
      description: "Allows users or healthcare professionals to provide retinal fundus images as input. Supports standard formats (JPG, PNG, JPEG) and live camera feeds."
    },
    {
      num: 2,
      title: "Image Preprocessing Module",
      description: "Enhances the quality of retinal images through noise reduction (Gaussian filter), contrast enhancement (CLAHE), green channel extraction, and pixel normalization."
    },
    {
      num: 3,
      title: "Feature Extraction Module",
      description: "Detects key features such as blood vessel structures, optic disc cup-to-disc ratio (CDR), macula lesions, and microvascular hemorrhages."
    },
    {
      num: 4,
      title: "Deep Learning (CNN) Model Module",
      description: "Employs hierarchical Convolutional Neural Network layers (Conv2D, Batch Normalization, ReLU, MaxPooling) trained on labeled fundus datasets to extract disease representations."
    },
    {
      num: 5,
      title: "Disease Prediction Module",
      description: "Classifies the retinal image and predicts conditions: Diabetic Retinopathy, Hypertensive Retinopathy, Glaucoma, Macular Degeneration, Cataract, or Normal."
    },
    {
      num: 6,
      title: "Result Visualization Module",
      description: "Presents predictions with confidence scores (e.g. 96.25%), positive/negative detection status, visual Grad-CAM heatmaps, and downloadable clinical PDF reports."
    }
  ],
  references: [
    "1. Gulshan, V., Peng, L., Coram, M., et al., 'Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs,' JAMA, Vol. 316, No. 22, pp. 2402–2410, 2016.",
    "2. Ting, D. S. W., Cheung, C. Y. L., Lim, G., et al., 'Development and Validation of a Deep Learning System for Diabetic Retinopathy and Related Eye Diseases Using Retinal Images from Multiethnic Populations,' JAMA, Vol. 318, No. 22, pp. 2211–2223, 2017.",
    "3. Pratt, H., Coenen, F., Broadbent, D. M., Harding, S. P., Zheng, Y., 'Convolutional Neural Networks for Diabetic Retinopathy,' Procedia Computer Science, Vol. 90, pp. 200–205, 2016.",
    "4. LeCun, Y., Bengio, Y., Hinton, G., 'Deep Learning,' Nature, Vol. 521, No. 7553, pp. 436–444, 2015.",
    "5. Abràmoff, M. D., Lavin, P. T., Birch, M., Shah, N., Folk, J. C., 'Pivotal Trial of an Autonomous AI-Based Diagnostic System for Detection of Diabetic Retinopathy,' npj Digital Medicine, Vol. 1, No. 39, 2018.",
    "6. Gargeya, R., Leng, T., 'Automated Identification of Diabetic Retinopathy Using Deep Learning,' Ophthalmology, Vol. 124, No. 7, pp. 962–969, 2017.",
    "7. Poplin, R., Varadarajan, A. V., Blumer, K., et al., 'Prediction of Cardiovascular Risk Factors from Retinal Fundus Photographs via Deep Learning,' Nature Biomedical Engineering, Vol. 2, No. 3, pp. 158–164, 2018.",
    "8. Li, Z., Keel, S., Liu, C., et al., 'An Automated Grading System for Detection of Vision-Threatening Referable Diabetic Retinopathy on the Basis of Color Fundus Photographs,' Diabetes Care, Vol. 41, No. 12, pp. 2509–2516, 2018.",
    "9. Grassmann, F., Mengelkamp, J., Brandl, C., et al., 'A Deep Learning Algorithm for Prediction of Age-Related Eye Disease Study Severity Scale for Age-Related Macular Degeneration from Color Fundus Photography,' Ophthalmology, Vol. 125, No. 9, pp. 1410–1420, 2018.",
    "10. De Fauw, J., Ledsam, J. R., Romera-Paredes, B., et al., 'Clinically Applicable Deep Learning for Diagnosis and Referral in Retinal Disease,' Nature Medicine, Vol. 24, No. 9, pp. 1342–1350, 2018."
  ]
};


