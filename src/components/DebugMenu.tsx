"use client";

import React, { useState, useEffect } from "react";
import { DEFECTS, DefectId, isDefectActive } from "@/config/defects.config";
import { Terminal, ShieldAlert, X, RefreshCw } from "lucide-react";

export const DebugMenu: React.FC = () => {
  const [isAdminEscalated, setIsAdminEscalated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [defectToggles, setDefectToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check localStorage.isAdmin for TB-2
    const checkAdmin = () => {
      try {
        const val = localStorage.getItem("isAdmin");
        if (val === "true" && isDefectActive("TB_02_LOCALSTORAGE_ADMIN_ESCALATION")) {
          setIsAdminEscalated(true);
        } else {
          setIsAdminEscalated(false);
        }
      } catch {
        // Ignore
      }
    };

    checkAdmin();
    const interval = setInterval(checkAdmin, 1500);

    // Load active toggles
    const initial: Record<string, boolean> = {};
    Object.keys(DEFECTS).forEach((k) => {
      initial[k] = isDefectActive(k as DefectId);
    });
    setDefectToggles(initial);

    return () => clearInterval(interval);
  }, []);

  if (!isAdminEscalated) return null;

  const handleToggleDefect = (key: string) => {
    const current = defectToggles[key] ?? true;
    const next = !current;
    setDefectToggles((prev) => ({ ...prev, [key]: next }));
    localStorage.setItem(`DEFECT_OVERRIDE_${key}`, String(next));
  };

  const handleResetAllDefects = () => {
    Object.keys(DEFECTS).forEach((k) => {
      localStorage.removeItem(`DEFECT_OVERRIDE_${k}`);
    });
    const reset: Record<string, boolean> = {};
    Object.keys(DEFECTS).forEach((k) => {
      reset[k] = DEFECTS[k as DefectId];
    });
    setDefectToggles(reset);
    window.location.reload();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-2xl hover:bg-red-700 animate-pulse border-2 border-white"
      >
        <Terminal className="h-4 w-4" />
        <span>Admin Debug Panel</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="w-full max-w-xl bg-gray-950 text-gray-100 h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <h3 className="text-base font-mono font-bold text-white">
                  Entropy 2K26 Judge & Admin Console
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* TB-2 Treasure Flag Display with exact rule prefix */}
            <div className="mt-4 p-4 rounded bg-red-950/70 border border-red-500 text-xs font-mono space-y-1">
              <span className="text-red-400 font-bold block uppercase tracking-wider">
                [Treasure Bug Claim Verification]
              </span>
              <p className="text-green-400 font-bold text-sm select-all">
                TREASURE_BUG_#2: FLAG&#123;admin_debug_mode_escalation_success&#125;
              </p>
              <p className="text-[11px] text-gray-400 pt-1">
                Triggered via localStorage.setItem(&apos;isAdmin&apos;, &apos;true&apos;).
              </p>
            </div>

            {/* Defect Toggles Table */}
            <div className="mt-6 flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Active Seeded Defects ({Object.keys(DEFECTS).length} Total)
                </h4>
                <button
                  onClick={handleResetAllDefects}
                  className="flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-white underline"
                >
                  <RefreshCw className="h-3 w-3" /> Reset Defaults
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-xs max-h-[60vh] overflow-y-auto pr-2">
                {Object.keys(DEFECTS).map((defectKey) => {
                  const isActive = defectToggles[defectKey] ?? true;
                  return (
                    <div
                      key={defectKey}
                      className="flex items-center justify-between p-2 rounded bg-gray-900 border border-gray-800 hover:border-gray-700"
                    >
                      <span className="text-[11px] truncate max-w-[320px]">
                        {defectKey}
                      </span>
                      <button
                        onClick={() => handleToggleDefect(defectKey)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {isActive ? "ACTIVE (BUG)" : "RESOLVED"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
