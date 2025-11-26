import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataRecord } from "@shared/schema";

interface SwotHeatmapProps {
  data: DataRecord[];
  isLoading?: boolean;
}

export function SwotHeatmap({ data, isLoading }: SwotHeatmapProps) {
  const heatmapData = useMemo(() => {
    const swotMap = new Map<string, Map<string, number>>();
    const swotCategories = ["Strengths", "Weaknesses", "Opportunities", "Threats"];
    const sectors = new Set<string>();

    data.forEach((record) => {
      if (record.swot && record.sector && record.sector.trim() && record.swot.trim()) {
        sectors.add(record.sector);
        if (!swotMap.has(record.swot)) {
          swotMap.set(record.swot, new Map());
        }
        const sectorMap = swotMap.get(record.swot)!;
        const count = sectorMap.get(record.sector) || 0;
        sectorMap.set(record.sector, count + 1);
      }
    });

    const topSectors = Array.from(sectors)
      .map((sector) => ({
        sector,
        total: Array.from(swotMap.values()).reduce(
          (sum, sectorMap) => sum + (sectorMap.get(sector) || 0),
          0
        ),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((s) => s.sector);

    const swotKeys = Array.from(swotMap.keys()).slice(0, 4);

    let maxValue = 0;
    swotKeys.forEach((swot) => {
      topSectors.forEach((sector) => {
        const value = swotMap.get(swot)?.get(sector) || 0;
        if (value > maxValue) maxValue = value;
      });
    });

    return { swotMap, topSectors, swotKeys, maxValue };
  }, [data]);

  const getColor = (value: number, maxValue: number) => {
    if (value === 0 || maxValue === 0) return "bg-muted/30";
    const intensity = value / maxValue;
    if (intensity < 0.2) return "bg-chart-1/20";
    if (intensity < 0.4) return "bg-chart-1/40";
    if (intensity < 0.6) return "bg-chart-1/60";
    if (intensity < 0.8) return "bg-chart-1/80";
    return "bg-chart-1";
  };

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

  const { swotMap, topSectors, swotKeys, maxValue } = heatmapData;

  if (swotKeys.length === 0 || topSectors.length === 0) {
    return (
      <Card className="hover-elevate transition-all duration-200" data-testid="chart-swot">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">SWOT Heatmap</CardTitle>
          <CardDescription>SWOT analysis distribution by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No SWOT data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-swot">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-swot-title">SWOT Heatmap</CardTitle>
        <CardDescription data-testid="chart-swot-desc">SWOT analysis distribution by sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full overflow-auto" data-testid="chart-swot-container">
          <div className="min-w-[400px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(${topSectors.length}, 1fr)` }}>
              <div className="h-8" />
              {topSectors.map((sector) => (
                <div
                  key={sector}
                  className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground px-1 truncate"
                  title={sector}
                >
                  {sector.length > 10 ? sector.slice(0, 10) + "..." : sector}
                </div>
              ))}

              {swotKeys.map((swot) => (
                <>
                  <div
                    key={`label-${swot}`}
                    className="h-12 flex items-center text-sm font-medium text-foreground pr-2"
                  >
                    {swot}
                  </div>
                  {topSectors.map((sector) => {
                    const value = swotMap.get(swot)?.get(sector) || 0;
                    return (
                      <div
                        key={`${swot}-${sector}`}
                        className={`h-12 rounded-md flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105 ${getColor(value, maxValue)} ${value > 0 ? "text-foreground" : "text-muted-foreground"}`}
                        title={`${swot} - ${sector}: ${value}`}
                      >
                        {value > 0 ? value : "-"}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Low</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 rounded bg-chart-1/20" />
                <div className="w-6 h-4 rounded bg-chart-1/40" />
                <div className="w-6 h-4 rounded bg-chart-1/60" />
                <div className="w-6 h-4 rounded bg-chart-1/80" />
                <div className="w-6 h-4 rounded bg-chart-1" />
              </div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
