import { type LucideIcon } from "lucide-react";
import { formatINR, formatDelta } from "@/lib/formatters";
import { motion, useMotionValue, animate } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useRef, memo } from "react";
import { Sparkline } from "./Sparkline";

interface SummaryCardProps {
  label: string;
  value: number;
  delta: number;
  icon?: LucideIcon;
  variant: "balance" | "income" | "expense" | "flow";
  index?: number;
  suffix?: string;
  className?: string;
  sparklineData?: number[];
}

const VARIANT_STYLES: Record<string, { iconBg: string; iconColor: string }> = {
  balance: { iconBg: "var(--z-accent-muted)", iconColor: "var(--z-accent)" },
  income: { iconBg: "var(--z-green-bg)", iconColor: "var(--z-green)" },
  expense: { iconBg: "var(--z-red-bg)", iconColor: "var(--z-red)" },
  flow: { iconBg: "rgba(139,124,248,0.12)", iconColor: "var(--z-violet)" },
};

function CountUp({ target, compact }: { target: number; compact: boolean }) {
  const count = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.2, ease: "easeOut",
      onUpdate: (v) => { 
        if (ref.current) {
          // Format with INR currency
          ref.current.textContent = formatINR(Math.round(v), compact); 
        }
      },
    });
    return controls.stop;
  }, [target, compact, count]);
  return <span ref={ref}>{formatINR(0, compact)}</span>;
}

function CountUpPlain({ target }: { target: number }) {
  const count = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.2, ease: "easeOut",
      onUpdate: (v) => { 
        if (ref.current) {
          // Plain number formatting (no currency)
          ref.current.textContent = Math.round(v).toLocaleString('en-IN'); 
        }
      },
    });
    return controls.stop;
  }, [target, count]);
  return <span ref={ref}>{Math.round(0).toLocaleString('en-IN')}</span>;
}

export const SummaryCard = memo(function SummaryCard({ 
  label, 
  value, 
  delta, 
  icon: Icon, 
  variant, 
  index = 0, 
  suffix, 
  className = '',
  sparklineData
}: SummaryCardProps) {
  const style = VARIANT_STYLES[variant];
  const isPositiveDelta = delta >= 0;
  const deltaColor = variant === "expense"
    ? (isPositiveDelta ? "var(--z-red)" : "var(--z-green)")
    : (isPositiveDelta ? "var(--z-green)" : "var(--z-red)");

  // Determine sparkline color based on trend
  const sparklineColor = sparklineData && sparklineData.length > 1
    ? (sparklineData[sparklineData.length - 1] >= sparklineData[0] ? style.iconColor : "var(--z-red)")
    : style.iconColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25, ease: "easeOut" }}
      className={`rounded-2xl border p-5 relative overflow-hidden theme-transition ${className}`}
      style={{ 
        background: "var(--z-bg-surface)",
        borderColor: "var(--z-border)",
        boxShadow: "var(--z-shadow-card)"
      }}
    >
      
      {/* Subtle top highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--z-card-highlight) 50%, transparent 100%)"
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          {/* Label - Medium weight, muted color */}
          <span 
            className="text-xs font-semibold uppercase tracking-wide" 
            style={{ 
              color: "var(--z-text-secondary)",
              letterSpacing: "0.05em"
            }}
          >
            {label}
          </span>
          {/* Sparkline or Icon */}
          {sparklineData && sparklineData.length > 0 ? (
            <Sparkline data={sparklineData} color={sparklineColor} width={80} height={32} />
          ) : Icon ? (
            <div 
              className="rounded-lg p-2" 
              style={{ background: style.iconBg }}
            >
              <Icon className="h-4 w-4" style={{ color: style.iconColor }} />
            </div>
          ) : null}
        </div>
        {/* Primary Value - Large, bold, prominent */}
        <div className="mb-2">
          <span 
            className="font-mono text-3xl font-bold tracking-tight block" 
            style={{ 
              color: "var(--z-text-primary)",
              lineHeight: 1.1
            }}
          >
            {suffix === "days" ? (
              <CountUpPlain target={value} />
            ) : (
              <CountUp target={value} compact />
            )}
            {suffix && (
              <span 
                className="text-base font-normal ml-1" 
                style={{ color: "var(--z-text-muted)" }}
              >
                {suffix}
              </span>
            )}
          </span>
        </div>
        {/* Metadata - Small, subtle, supportive */}
        <div className="flex items-center gap-1.5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 300 }}>
            {isPositiveDelta ? <TrendingUp className="h-3.5 w-3.5" style={{ color: deltaColor }} /> : <TrendingDown className="h-3.5 w-3.5" style={{ color: deltaColor }} />}
          </motion.div>
          <span 
            className="text-xs font-semibold" 
            style={{ color: deltaColor }}
          >
            {formatDelta(delta)}
          </span>
          <span 
            className="text-[11px] font-medium" 
            style={{ color: "var(--z-text-dim)" }}
          >
            vs last month
          </span>
        </div>
      </div>
    </motion.div>
  );
});
