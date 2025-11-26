import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataRecord } from "@shared/schema";

interface CityChartProps {
  data: DataRecord[];
  isLoading?: boolean;
}

export function CityChart({ data, isLoading }: CityChartProps) {
  const chartData = useMemo(() => {
    const cityMap = new Map<
      string,
      { count: number; avgIntensity: number; totalIntensity: number; avgRelevance: number; totalRelevance: number }
    >();

    data.forEach((record) => {
      if (record.city && record.city.trim()) {
        const existing = cityMap.get(record.city) || {
          count: 0,
          avgIntensity: 0,
          totalIntensity: 0,
          avgRelevance: 0,
          totalRelevance: 0,
        };
        cityMap.set(record.city, {
          count: existing.count + 1,
          totalIntensity: existing.totalIntensity + (record.intensity || 0),
          avgIntensity: 0,
          totalRelevance: existing.totalRelevance + (record.relevance || 0),
          avgRelevance: 0,
        });
      }
    });

    return Array.from(cityMap.entries())
      .map(([city, data]) => ({
        city,
        count: data.count,
        intensity: Math.round((data.totalIntensity / data.count) * 10) / 10,
        relevance: Math.round((data.totalRelevance / data.count) * 10) / 10,
      }))
      .filter((item) => item.count > 5)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
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
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg border shadow-lg">
          <p className="font-medium text-foreground">{data.city}</p>
          <div className="text-sm text-muted-foreground space-y-1 mt-1">
            <p>Records: <span className="text-foreground font-medium">{data.count}</span></p>
            <p>Avg Intensity: <span className="text-foreground font-medium">{data.intensity}</span></p>
            <p>Avg Relevance: <span className="text-foreground font-medium">{data.relevance}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="hover-elevate transition-all duration-200" data-testid="chart-city">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">City-wise Impact</CardTitle>
          <CardDescription>Impact analysis across major cities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No city data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-city">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-city-title">City-wise Impact</CardTitle>
        <CardDescription data-testid="chart-city-desc">Bubble size indicates number of records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-city-container">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                type="number"
                dataKey="intensity"
                name="Intensity"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                label={{ value: "Avg Intensity", position: "bottom", offset: -5, fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="relevance"
                name="Relevance"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                label={{ value: "Avg Relevance", angle: -90, position: "insideLeft", fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="count" range={[100, 1000]} name="Records" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Cities"
                data={chartData}
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
