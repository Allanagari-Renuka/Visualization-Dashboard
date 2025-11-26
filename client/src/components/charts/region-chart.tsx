import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataRecord } from "@shared/schema";

interface RegionChartProps {
  data: DataRecord[];
  isLoading?: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export function RegionChart({ data, isLoading }: RegionChartProps) {
  const chartData = useMemo(() => {
    const regionMap = new Map<string, number>();

    data.forEach((record) => {
      if (record.region && record.region.trim()) {
        const count = regionMap.get(record.region) || 0;
        regionMap.set(record.region, count + 1);
      }
    });

    const sorted = Array.from(regionMap.entries())
      .map(([region, count]) => ({ name: region, value: count }))
      .sort((a, b) => b.value - a.value);

    const top5 = sorted.slice(0, 5);
    const othersCount = sorted.slice(5).reduce((acc, item) => acc + item.value, 0);

    if (othersCount > 0) {
      top5.push({ name: "Others", value: othersCount });
    }

    return top5;
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg border shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="text-foreground font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-region">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-region-title">Region-wise Data</CardTitle>
        <CardDescription data-testid="chart-region-desc">Distribution of data across regions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-region-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name.length > 12 ? name.slice(0, 12) + "..." : name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
