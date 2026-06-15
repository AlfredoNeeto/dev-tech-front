import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendInsight } from "@/types/dashboard";

export function TrendChart({ data, stack }: { data: TrendInsight[]; stack: string }) {
  const chartData = data.filter((item) => item.stack === stack);

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="oklch(var(--border))" vertical={false} />
          <XAxis dataKey="month" stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={34} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
              borderRadius: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="totalJobs"
            stroke="oklch(var(--primary))"
            strokeWidth={3}
            dot={{ r: 3, fill: "oklch(var(--primary))" }}
            activeDot={{ r: 5, fill: "oklch(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
