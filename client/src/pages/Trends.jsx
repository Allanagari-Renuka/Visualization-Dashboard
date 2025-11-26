// pages/trends.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { useFilters } from "@/lib/filter-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Trends() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { selectedFilters, setFilters } = useFilters();

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const { data: allData = [], isLoading: isDataLoading } = useQuery({
    queryKey: ["/api/data/filter", selectedFilters],
    queryFn: async () => {
      const queryString = buildQueryString();
      const url = queryString ? `/api/data/filter?${queryString}` : "/api/data";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });

  const { isLoading: isFiltersLoading } = useQuery({
    queryKey: ["/api/filters"],
    queryFn: async () => {
      const res = await fetch("/api/filters");
      if (!res.ok) throw new Error("Failed to fetch filters");
      const data = await res.json();
      setFilters(data);
      return data;
    },
  });

  const isLoading = isDataLoading || isFiltersLoading;

  // Process data for year trends
  const yearTrends = allData.reduce((acc, item) => {
    const year = item.start_year || item.end_year || item.published;
    if (year && year > 2000 && year < 2100) {
      if (!acc[year]) {
        acc[year] = { year, intensity: 0, likelihood: 0, relevance: 0, impact: 0, count: 0 };
      }
      acc[year].intensity += item.intensity || 0;
      acc[year].likelihood += item.likelihood || 0;
      acc[year].relevance += item.relevance || 0;
      acc[year].impact += item.impact || 0;
      acc[year].count += 1;
    }
    return acc;
  }, {});

  const yearData = Object.values(yearTrends)
    .map(item => ({
      year: item.year,
      avgIntensity: parseFloat((item.intensity / item.count).toFixed(2)),
      avgLikelihood: parseFloat((item.likelihood / item.count).toFixed(2)),
      avgRelevance: parseFloat((item.relevance / item.count).toFixed(2)),
      avgImpact: parseFloat((item.impact / item.count).toFixed(2)),
      count: item.count,
    }))
    .sort((a, b) => a.year - b.year);

  // Calculate trend direction
  const calculateTrend = (data, key) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d[key], 0) / 3;
    const older = data.slice(0, 3).reduce((sum, d) => sum + d[key], 0) / 3;
    return ((recent - older) / older * 100).toFixed(1);
  };

  const intensityTrend = calculateTrend(yearData, 'avgIntensity');
  const likelihoodTrend = calculateTrend(yearData, 'avgLikelihood');
  const volumeTrend = calculateTrend(yearData, 'count');

  // Sector trends over time
  const sectorYearTrends = allData.reduce((acc, item) => {
    const year = item.start_year || item.end_year || item.published;
    if (year && year > 2000 && year < 2100 && item.sector) {
      const key = `${year}-${item.sector}`;
      if (!acc[key]) {
        acc[key] = { year, sector: item.sector, intensity: 0, count: 0 };
      }
      acc[key].intensity += item.intensity || 0;
      acc[key].count += 1;
    }
    return acc;
  }, {});

  // Get top 5 sectors
  const topSectors = Object.entries(
    allData.reduce((acc, item) => {
      if (item.sector) acc[item.sector] = (acc[item.sector] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sector]) => sector);

  const sectorTrendData = yearData.map(({ year }) => {
    const point = { year };
    topSectors.forEach(sector => {
      const key = `${year}-${sector}`;
      point[sector] = sectorYearTrends[key]?.count || 0;
    });
    return point;
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Trends Analysis</h1>
          <p className="text-muted-foreground">
            Temporal patterns and evolving metrics over time
          </p>
        </div>

        {/* Trend Indicators */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Intensity Trend</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{Math.abs(intensityTrend)}%</div>
                {intensityTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {intensityTrend > 0 ? 'Increasing' : 'Decreasing'} over time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Likelihood Trend</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{Math.abs(likelihoodTrend)}%</div>
                {likelihoodTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {likelihoodTrend > 0 ? 'Increasing' : 'Decreasing'} over time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Data Volume Trend</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{Math.abs(volumeTrend)}%</div>
                {volumeTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {volumeTrend > 0 ? 'Growing' : 'Declining'} data points
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {/* Multi-metric Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Over Time</CardTitle>
              <CardDescription>Average intensity, likelihood, and relevance by year</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={yearData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgIntensity" stroke="#8884d8" name="Avg Intensity" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgLikelihood" stroke="#82ca9d" name="Avg Likelihood" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgRelevance" stroke="#ffc658" name="Avg Relevance" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Data Volume with Intensity Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Volume & Intensity Correlation</CardTitle>
              <CardDescription>Data volume with average intensity overlay</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={yearData}>
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Data Volume" fillOpacity={0.6} />
                    <Line yAxisId="right" type="monotone" dataKey="avgIntensity" stroke="#ff8042" name="Avg Intensity" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Sector Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Top Sectors Evolution</CardTitle>
              <CardDescription>How the top 5 sectors have evolved over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={sectorTrendData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {topSectors.map((sector, index) => (
                      <Area
                        key={sector}
                        type="monotone"
                        dataKey={sector}
                        stackId="1"
                        stroke={COLORS[index]}
                        fill={COLORS[index]}
                        fillOpacity={0.6}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}