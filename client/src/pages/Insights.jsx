// pages/insights.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { useFilters } from "@/lib/filter-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Insights() {
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

  // Process data for insights
  const sectorInsights = allData.reduce((acc, item) => {
    if (item.sector) {
      acc[item.sector] = (acc[item.sector] || 0) + 1;
    }
    return acc;
  }, {});

  const sectorData = Object.entries(sectorInsights)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const pestleInsights = allData.reduce((acc, item) => {
    if (item.pestle) {
      acc[item.pestle] = (acc[item.pestle] || 0) + 1;
    }
    return acc;
  }, {});

  const pestleData = Object.entries(pestleInsights)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const avgIntensityBySector = Object.entries(
    allData.reduce((acc, item) => {
      if (item.sector && item.intensity) {
        if (!acc[item.sector]) acc[item.sector] = { total: 0, count: 0 };
        acc[item.sector].total += item.intensity;
        acc[item.sector].count += 1;
      }
      return acc;
    }, {})
  )
    .map(([name, data]) => ({
      name,
      avgIntensity: (data.total / data.count).toFixed(2),
    }))
    .sort((a, b) => b.avgIntensity - a.avgIntensity)
    .slice(0, 10);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B9D", "#C71585", "#20B2AA"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Key Insights</h1>
          <p className="text-muted-foreground">
            Deep analysis and patterns across your data
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sector Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Top Sectors by Volume</CardTitle>
              <CardDescription>Distribution of data points across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={sectorData}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Average Intensity by Sector */}
          <Card>
            <CardHeader>
              <CardTitle>Average Intensity by Sector</CardTitle>
              <CardDescription>Mean intensity scores across top sectors</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={avgIntensityBySector}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgIntensity" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* PESTLE Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>PESTLE Analysis Distribution</CardTitle>
              <CardDescription>Breakdown of insights by PESTLE categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pestleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pestleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}