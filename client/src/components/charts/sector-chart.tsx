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
import type { DataRecord } from "@shared/schema";

interface SectorChartProps {
  data: DataRecord[];
  isLoading?: boolean;
}

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export function SectorChart({ data, isLoading }: SectorChartProps) {
  const chartData = useMemo(() => {
    const sectorMap = new Map<string, number>();

    data.forEach((record) => {
      if (record.sector && record.sector.trim()) {
        const count = sectorMap.get(record.sector) || 0;
        sectorMap.set(record.sector, count + 1);
      }
    });

    return Array.from(sectorMap.entries())
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
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
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-sector">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-sector-title">Sector Distribution</CardTitle>
        <CardDescription data-testid="chart-sector-desc">Top 10 sectors by record count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-sector-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis
                type="category"
                dataKey="sector"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="count" name="Records" radius={[0, 4, 4, 0]}>
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
