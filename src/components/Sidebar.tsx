import React from "react";
import { NavTab } from "../types";
import { 
  Home, 
  UploadCloud, 
  Sliders, 
  Cpu, 
  BarChart3, 
  History, 
  Info,
  Network, 
  BookOpen, 
  Code2, 
  Eye, 
  LogOut,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasUploadedImage: boolean;
  hasAnalysisResult: boolean;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hasUploadedImage,
  hasAnalysisResult,
  historyCount
}) => {
  const navItems = [
    {
      id: "home" as NavTab,
      label: "Home",
      icon: Home,
      badge: null
    },
    {
      id: "upload" as NavTab,
      label: "Upload Image",
      icon: UploadCloud,
      badge: hasUploadedImage ? "Ready" : null
    },
    {
      id: "preprocessing" as NavTab,
      label: "Image Preprocessing",
      icon: Sliders,
      badge: hasUploadedImage ? "Active" : null
    },
    {
      id: "cnn-analysis" as NavTab,
      label: "Feature Extraction & CNN",
      icon: Cpu,
      badge: hasUploadedImage ? "CNN" : null
    },
    {
      id: "results" as NavTab,
      label: "Prediction Results",
      icon: BarChart3,
      badge: hasAnalysisResult ? "96.25%" : null
    },
    {
      id: "history" as NavTab,
      label: "History",
      icon: History,
      badge: historyCount > 0 ? historyCount.toString() : null
    },
    {
      id: "about" as NavTab,
      label: "About Project",
      icon: Info,
      badge: "Spec"
    },
    {
      id: "architecture" as NavTab,
      label: "System Architecture",
      icon: Network,
      badge: "Fig 4.1"
    },
    {
      id: "paper" as NavTab,
      label: "Research Article (IJIRCCE)",
      icon: BookOpen,
      badge: "2026"
    },
    {
      id: "plagiarism" as NavTab,
      label: "Code Plagiarism Checker",
      icon: Code2,
      badge: null
    }
  ];

  return (
    <aside 
      id="app-main-sidebar"
      className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none"
    >
      {/* Sidebar Header matching Fig 6.1 */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
              Retinal Disease
            </h1>
            <p className="text-xs text-sky-400 font-medium">Prediction System</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-sky-400 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Journal Footer Citation & Reset */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <button
          onClick={() => onSelectTab("paper")}
          className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
              IJIRCCE Published
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1 truncate">
            Vol. 14, Issue 6 (June 2026)
          </p>
          <p className="text-[10px] text-slate-400">R.V.S. College of Engineering</p>
        </button>

        <button
          onClick={() => onSelectTab("home")}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Reset / Return Home</span>
        </button>
      </div>
    </aside>
  );
};
