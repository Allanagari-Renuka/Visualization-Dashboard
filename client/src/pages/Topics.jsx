// pages/topics.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { useFilters } from "@/lib/filter-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from "recharts";
import { Tag, TrendingUp, Target } from "lucide-react";

export default function Topics() {
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

  // Process topic data
  const topicStats = allData.reduce((acc, item) => {
    if (item.topic) {
      if (!acc[item.topic]) {
        acc[item.topic] = { 
          count: 0, 
          totalIntensity: 0, 
          totalLikelihood: 0, 
          totalRelevance: 0,
          totalImpact: 0,
          sectors: new Set(),
          regions: new Set()
        };
      }
      acc[item.topic].count += 1;
      acc[item.topic].totalIntensity += item.intensity || 0;
      acc[item.topic].totalLikelihood += item.likelihood || 0;
      acc[item.topic].totalRelevance += item.relevance || 0;
      acc[item.topic].totalImpact += item.impact || 0;
      if (item.sector) acc[item.topic].sectors.add(item.sector);
      if (item.region) acc[item.topic].regions.add(item.region);
    }
    return acc;
  }, {});

  const topicData = Object.entries(topicStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      avgIntensity: parseFloat((stats.totalIntensity / stats.count).toFixed(2)),
      avgLikelihood: parseFloat((stats.totalLikelihood / stats.count).toFixed(2)),
      avgRelevance: parseFloat((stats.totalRelevance / stats.count).toFixed(2)),
      avgImpact: parseFloat((stats.totalImpact / stats.count).toFixed(2)),
      sectors: stats.sectors.size,
      regions: stats.regions.size,
    }))
    .sort((a, b) => b.count - a.count);

  const top15Topics = topicData.slice(0, 15);
  const top10Topics = topicData.slice(0, 10);
  const top6Topics = topicData.slice(0, 6);

  // Topic intensity vs relevance scatter
  const scatterData = top15Topics.map(t => ({
    name: t.name,
    x: t.avgIntensity,
    y: t.avgRelevance,
    z: t.count,
  }));

  // Calculate summary stats
  const totalTopics = topicData.length;
  const avgTopicsPerSector = (
    topicData.reduce((sum, t) => sum + t.sectors, 0) / totalTopics
  ).toFixed(1);
  const mostDiverseTopic = topicData.reduce((max, t) => 
    t.sectors > max.sectors ? t : max, 
    { name: 'N/A', sectors: 0 }
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B9D", "#C71585", "#20B2AA"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Topic Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive view of topics and their characteristics
          </p>
        </div>

        {/* Topic Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTopics}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique topics identified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Sector Coverage</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTopicsPerSector}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sectors per topic on average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Most Diverse Topic</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate" title={mostDiverseTopic.name}>
                {mostDiverseTopic.name.substring(0, 20)}...
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mostDiverseTopic.sectors} sectors covered
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Topics by Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Top Topics by Volume</CardTitle>
              <CardDescription>Most frequently occurring topics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={top15Topics} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Topic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Distribution</CardTitle>
              <CardDescription>Proportional breakdown of top 10 topics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={top10Topics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.substring(0, 12)}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {top10Topics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Average Metrics by Topic */}
          <Card>
            <CardHeader>
              <CardTitle>Average Metrics by Topic</CardTitle>
              <CardDescription>Intensity, likelihood, and relevance for top topics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={top10Topics}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgIntensity" fill="#8884d8" name="Intensity" />
                    <Bar dataKey="avgLikelihood" fill="#82ca9d" name="Likelihood" />
                    <Bar dataKey="avgRelevance" fill="#ffc658" name="Relevance" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Topic Metrics Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Performance Radar</CardTitle>
              <CardDescription>Multi-dimensional comparison of top 6 topics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={top6Topics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar name="Intensity" dataKey="avgIntensity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                    <Radar name="Likelihood" dataKey="avgLikelihood" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Intensity vs Relevance Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Intensity vs Relevance</CardTitle>
              <CardDescription>Scatter plot showing relationship (bubble size = volume)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart>
                    <XAxis type="number" dataKey="x" name="Avg Intensity" />
                    <YAxis type="number" dataKey="y" name="Avg Relevance" />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Topics" data={scatterData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Topic Coverage */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Coverage Analysis</CardTitle>
              <CardDescription>Geographic and sector reach by topic</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={top10Topics}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sectors" fill="#82ca9d" name="Unique Sectors" />
                    <Bar dataKey="regions" fill="#8884d8" name="Unique Regions" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}