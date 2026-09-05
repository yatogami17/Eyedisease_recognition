import { SampleRetinalImage, SymptomConfig, PlagiarismPreset } from "./types";

export const SAMPLE_IMAGES: SampleRetinalImage[] = [
  {
    id: "sample-normal",
    name: "Normal Healthy Retina",
    conditionKey: "normal",
    clinicalTitle: "Healthy Retinal Fundus (Normal)",
    shortDescription: "A pristine retina showing a clear optic disc, healthy macula, and standard retinal vascular architecture.",
    longClinicalDescription: "Demonstrates healthy physiological parameters. Vertical cup-to-disc ratio is 0.3, within the normal range of 0.3-0.4. The neuroretinal rim is robust and uniform, obeying the ISNT rule (Inferior > Superior > Nasal > Temporal thickness). The macular region is homogeneous with an intact foveal reflex. Retinal vessels radiate uniformly with zero hemorrhages, exudates, or drusen deposits.",
    primaryBgColor: "radial-gradient(circle, #ff6b3d 0%, #d43d1a 60%, #8c1e03 100%)",
    markers: [
      {
        id: "m-norm-1",
        x: 35,
        y: 48,
        label: "Optic Disc (Healthy)",
        description: "The entry point for major blood vessels. It has well-defined edges, a normal vertical cup-to-disc ratio of 0.3, and robust pinkish neuroretinal rim.",
        severity: "info"
      },
      {
        id: "m-norm-2",
        x: 65,
        y: 52,
        label: "Healthy Macula",
        description: "The highly sensitive central retinal zone responsible for sharp vision. Note the dark pigmentation and fine foveal reflex in the center.",
        severity: "info"
      },
      {
        id: "m-norm-3",
        x: 48,
        y: 28,
        label: "Main Temporal Arcade",
        description: "Standard branching trajectories of arterioles and venules forming a healthy protective basket layout over the macular poles.",
        severity: "info"
      }
    ]
  },
  {
    id: "sample-diabetic",
    name: "Diabetic Retinopathy",
    conditionKey: "diabetic",
    clinicalTitle: "Severe Non-Proliferative Diabetic Retinopathy",
    shortDescription: "Retina displaying microaneurysms, dot-and-blot hemorrhages, and waxy lipoprotein deposits (hard exudates).",
    longClinicalDescription: "Visualizes extensive vascular damage secondary to chronic hyperglycemia. Present are classic lesions: tiny red spots (microaneurysms) representing outpalpations of vessel walls; dark-red circular spots (intraretinal hemorrhages); and yellow, crisp-edged deposits (hard exudates) representing leaked lipids within the deep sensory layers of the retina.",
    primaryBgColor: "radial-gradient(circle, #ff5e3a 0%, #cc3311 50%, #7d1502 100%)",
    markers: [
      {
        id: "m-dr-1",
        x: 52,
        y: 58,
        label: "Lipid Hard Exudates",
        description: "Yellow waxy deposits formed from protein and lipid leakage through damaged capillary walls. Clustered near the macula.",
        severity: "danger"
      },
      {
        id: "m-dr-2",
        x: 62,
        y: 42,
        label: "Dot Hemorrhage",
        description: "Small ruptured capillaries bleeding into deep retinal layers. Appears as crisp red blots in the extra-macular quadrants.",
        severity: "danger"
      },
      {
        id: "m-dr-3",
        x: 38,
        y: 68,
        label: "Microaneurysm",
        description: "Tiny micro-ballooning of weak blood vessels. Earliest signs of diabetic retinal damage. Appears as scattered red micro-dots.",
        severity: "warning"
      }
    ]
  },
  {
    id: "sample-glaucoma",
    name: "Glaucomatous Neuropathy",
    conditionKey: "glaucoma",
    clinicalTitle: "Suspected Advanced Open-Angle Glaucoma",
    shortDescription: "Retina focusing on the optic disc showing major excavation (cupping) due to high intraocular pressure and retinal nerve fiber loss.",
    longClinicalDescription: "Exhibits advanced glaucomatous remodeling of the optic nerve head. The central pale cup is severely enlarged, prompting a vertical cup-to-disc ratio of 0.8. The pink neuroretinal rim is critically thinned superiorly and inferiorly. Notice key vascular cues: 'bayoneting' (vessels bending sharply at the rim edge) and 'nasalization' (primary vessels pushed to the inner side).",
    primaryBgColor: "radial-gradient(circle, #f58442 0%, #c44d18 60%, #7d1d02 100%)",
    markers: [
      {
        id: "m-glau-1",
        x: 35,
        y: 48,
        label: "Significantly Enlarged Optic Cup",
        description: "The pale, white center has expanded dramatically to 80% (Cup-to-Disc Ratio of 0.80) due to localized nerve cell apoptosis.",
        severity: "danger"
      },
      {
        id: "m-glau-2",
        x: 32,
        y: 38,
        label: "Rim Thinning (Loss of Nerve Fibers)",
        description: "Crucial structural deterioration of the neuroretinal rim. Note the extreme pallor and narrow width of the pink functional rim.",
        severity: "danger"
      },
      {
        id: "m-glau-3",
        x: 40,
        y: 52,
        label: "Nasalized Vessel Branch",
        description: "Major central retinal vessels are compressed and pushed toward the nasal margins of the disc, characteristic of optic nerve excavation.",
        severity: "warning"
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

