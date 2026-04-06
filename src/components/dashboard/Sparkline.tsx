import { LineChart, Line } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ 
  data, 
  color = "#3D6EFA",
  width = 80,
  height = 32
}: SparklineProps) {
  // Convert array to chart data format
  const chartData = data.map((value, index) => ({
    index,
    value
  }));

  // Calculate min/max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return (
    <LineChart
      width={width}
      height={height}
      data={chartData}
      margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
    >
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={true}
        animationDuration={800}
      />
    </LineChart>
  );
}
