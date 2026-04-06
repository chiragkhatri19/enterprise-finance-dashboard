import { formatINR } from "@/lib/formatters";

interface TooltipPayload {
  name: string;
  value: number;
  color?: string;
  payload?: {
    month?: string;
    date?: string;
    credits?: number;
    debits?: number;
    prevValue?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  chartType?: "area" | "bar" | "line" | "pie";
  showDelta?: boolean;
}

export function CustomTooltip({ 
  active, 
  payload, 
  label, 
  chartType = "area",
  showDelta = false 
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Calculate delta if previous value exists
  const firstPayload = payload[0];
  const currentValue = firstPayload.value;
  const prevValue = firstPayload.payload?.prevValue;
  const delta = prevValue ? currentValue - prevValue : null;
  const deltaPercent = prevValue && prevValue !== 0 ? ((delta! / Math.abs(prevValue)) * 100).toFixed(1) : null;

  return (
    <div
      className="rounded-lg border-l-4 p-3 shadow-xl backdrop-blur-sm"
      style={{
        background: "var(--z-bg-surface)",
        borderColor: "var(--z-accent)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        minWidth: "200px",
      }}
    >
      {/* Label/Date */}
      {label && (
        <div className="mb-2 pb-2 border-b" style={{ borderColor: "var(--z-border)" }}>
          <p className="text-xs font-semibold" style={{ color: "var(--z-text-primary)" }}>
            {label}
          </p>
        </div>
      )}

      {/* Data Items */}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Color indicator */}
              {entry.color && (
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
              )}
              <span className="text-xs" style={{ color: "var(--z-text-secondary)" }}>
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--z-text-primary)" }}>
              {formatINR(entry.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Delta vs Previous Period */}
      {showDelta && delta !== null && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--z-border)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]" style={{ color: "var(--z-text-muted)" }}>
              vs last period:
            </span>
            <span
              className="text-[10px] font-mono font-semibold"
              style={{
                color: delta >= 0 ? "var(--z-green)" : "var(--z-red)",
              }}
            >
              {delta >= 0 ? "↑" : "↓"} {formatINR(Math.abs(delta))}
              {deltaPercent && ` (${deltaPercent}%)`}
            </span>
          </div>
        </div>
      )}

      {/* Additional context for area charts */}
      {chartType === "area" && firstPayload.payload?.credits !== undefined && (
        <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: "var(--z-border)" }}>
          <div className="flex items-center justify-between text-[10px]">
            <span style={{ color: "var(--z-text-muted)" }}>Credits:</span>
            <span className="font-mono" style={{ color: "var(--z-green)" }}>
              +{formatINR(firstPayload.payload.credits)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span style={{ color: "var(--z-text-muted)" }}>Debits:</span>
            <span className="font-mono" style={{ color: "var(--z-red)" }}>
              -{formatINR(firstPayload.payload.debits)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized tooltips for different chart types
export function AreaChartTooltip(props: Omit<CustomTooltipProps, "chartType">) {
  return <CustomTooltip {...props} chartType="area" showDelta={true} />;
}

export function BarChartTooltip(props: Omit<CustomTooltipProps, "chartType">) {
  return <CustomTooltip {...props} chartType="bar" showDelta={true} />;
}

export function LineChartTooltip(props: Omit<CustomTooltipProps, "chartType">) {
  return <CustomTooltip {...props} chartType="line" showDelta={true} />;
}

export function PieChartTooltip(props: Omit<CustomTooltipProps, "chartType" | "showDelta">) {
  return <CustomTooltip {...props} chartType="pie" showDelta={false} />;
}
