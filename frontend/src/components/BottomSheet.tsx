// Mobile Draggable Bottom Sheet with peek / half / full snap points

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";

interface BottomSheetProps {
  children: React.ReactNode;
  title?: string;
  peekHeight?: number;
  initialSnap?: "peek" | "half" | "full";
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  title,
  peekHeight = 120,
  initialSnap = "peek",
  className = "",
}) => {
  const [snap, setSnap] = useState<"peek" | "half" | "full">(initialSnap);

  const getTranslateY = () => {
    switch (snap) {
      case "full":
        return 0;
      case "half":
        return "45%";
      case "peek":
      default:
        return `calc(100% - ${peekHeight}px)`;
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    if (velocity.y < -300 || offset.y < -100) {
      if (snap === "peek") setSnap("half");
      else if (snap === "half") setSnap("full");
    } else if (velocity.y > 300 || offset.y > 100) {
      if (snap === "full") setSnap("half");
      else if (snap === "half") setSnap("peek");
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      animate={{ y: getTranslateY() }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed left-0 right-0 bottom-0 z-40 md:hidden bg-cream-card dark:bg-dark-card border-t border-cream-border dark:border-dark-border rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] ${className}`}
    >
      {/* Drag Handle Bar */}
      <div className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
        <div className="w-12 h-1.5 rounded-full bg-cream-border dark:bg-dark-border" />
        {title && (
          <div className="w-full px-6 pt-2 flex items-center justify-between text-xs font-bold font-sora text-dark-bg dark:text-cream">
            <span>{title}</span>
            <span className="text-[10px] font-mono text-muted-dark dark:text-cream/50 uppercase">
              Swipe {snap === "peek" ? "Up" : "Down"}
            </span>
          </div>
        )}
      </div>

      {/* Sheet Content with dynamic scroll */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        {children}
      </div>
    </motion.div>
  );
};
