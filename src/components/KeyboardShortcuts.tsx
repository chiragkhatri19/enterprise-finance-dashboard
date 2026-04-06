import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command, Search, Plus, Download, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShortcutItem {
  keys: string[];
  description: string;
  icon?: React.ReactNode;
}

const SHORTCUTS: Record<string, ShortcutItem[]> = {
  Navigation: [
    { keys: ["1"], description: "Go to Dashboard", icon: <Command className="h-4 w-4" /> },
    { keys: ["2"], description: "Go to Transactions", icon: <Command className="h-4 w-4" /> },
    { keys: ["3"], description: "Go to Insights", icon: <Command className="h-4 w-4" /> },
  ],
  Actions: [
    { keys: ["/"], description: "Focus search bar", icon: <Search className="h-4 w-4" /> },
    { keys: ["N"], description: "New transaction (Admin)", icon: <Plus className="h-4 w-4" /> },
    { keys: ["E"], description: "Export current view", icon: <Download className="h-4 w-4" /> },
  ],
  General: [
    { keys: ["?"], description: "Show keyboard shortcuts", icon: <HelpCircle className="h-4 w-4" /> },
    { keys: ["ESC"], description: "Close modal/drawer", icon: <X className="h-4 w-4" /> },
  ],
};

export function KeyboardShortcutsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {Object.entries(SHORTCUTS).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                      <span className="text-sm">{item.description}</span>
                    </div>
                    <div className="flex gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <kbd
                          key={keyIdx}
                          className="px-2 py-1 text-xs font-mono bg-muted border rounded-md shadow-sm min-w-[24px] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground text-center">
          Press any shortcut key to use it • ESC to close
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Navigation shortcuts
      if (key === "1") {
        e.preventDefault();
        navigate("/");
      } else if (key === "2") {
        e.preventDefault();
        navigate("/transactions");
      } else if (key === "3") {
        e.preventDefault();
        navigate("/insights");
      }
      // Action shortcuts
      else if (key === "/") {
        e.preventDefault();
        // Focus search bar - dispatch custom event
        window.dispatchEvent(new CustomEvent("focus-search"));
      } else if (key === "n" && !e.shiftKey) {
        e.preventDefault();
        // Open new transaction modal - dispatch custom event
        window.dispatchEvent(new CustomEvent("new-transaction"));
      } else if (key === "e" && !e.shiftKey) {
        e.preventDefault();
        // Export current view - dispatch custom event
        window.dispatchEvent(new CustomEvent("export-view"));
      }
      // Help shortcut
      else if (key === "?" || (key === "/" && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Close modal
      else if (key === "escape") {
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      {children}
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </>
  );
}
