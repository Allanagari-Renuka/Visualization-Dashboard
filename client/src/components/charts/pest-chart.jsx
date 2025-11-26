// PestChart.jsx
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export function PestChart({ data, isLoading }) {
  const chartData = useMemo(() => {
    const pestleMap = new Map();

    data.forEach((record) => {
      if (record.pestle && record.pestle.trim()) {
        const existing = pestleMap.get(record.pestle) || { count: 0, avgIntensity: 0, totalIntensity: 0 };
        pestleMap.set(record.pestle, {
          count: existing.count + 1,
          totalIntensity: existing.totalIntensity + (record.intensity || 0),
          avgIntensity: 0,
        });
      }
    });

    return Array.from(pestleMap.entries())
      .map(([pestle, data]) => ({
        pestle,
        count: data.count,
        avgIntensity: Math.round((data.totalIntensity / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-pest">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-pest-title">PESTLE Analysis</CardTitle>
        <CardDescription data-testid="chart-pest-desc">Political, Economic, Social, Technical, Legal, Environmental factors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-pest-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="pestle"
                tick={{ fontSize: 11, angle: -45, textAnchor: "end" }}
                className="text-muted-foreground"
                height={60}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value, name) => [
                  value,
                  name === "count" ? "Records" : "Avg Intensity",
                ]}
              />
              <Bar dataKey="count" name="Records" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}