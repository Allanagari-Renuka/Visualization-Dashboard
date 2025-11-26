import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataRecord } from "@shared/schema";

interface IntensityYearChartProps {
  data: DataRecord[];
  isLoading?: boolean;
}

export function IntensityYearChart({ data, isLoading }: IntensityYearChartProps) {
  const chartData = useMemo(() => {
    const yearMap = new Map<number, { total: number; count: number }>();
    
    data.forEach((record) => {
      const year = record.end_year ? Number(record.end_year) : null;
      if (year && !isNaN(year) && year > 1900 && year < 2100 && record.intensity) {
        const existing = yearMap.get(year) || { total: 0, count: 0 };
        yearMap.set(year, {
          total: existing.total + record.intensity,
          count: existing.count + 1,
        });
      }
    });

    return Array.from(yearMap.entries())
      .map(([year, { total, count }]) => ({
        year,
        avgIntensity: Math.round((total / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => a.year - b.year)
      .slice(-20);
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
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-intensity-year">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-intensity-year-title">Intensity vs Year</CardTitle>
        <CardDescription data-testid="chart-intensity-year-desc">Average intensity trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-intensity-year-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgIntensity"
                name="Avg Intensity"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
