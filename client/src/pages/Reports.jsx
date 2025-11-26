// pages/reports.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { useFilters } from "@/lib/filter-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Globe, Tag } from "lucide-react";

export default function Reports() {
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

  // Calculate comprehensive statistics
  const stats = {
    totalRecords: allData.length,
    uniqueSectors: new Set(allData.map(d => d.sector).filter(Boolean)).size,
    uniqueRegions: new Set(allData.map(d => d.region).filter(Boolean)).size,
    uniqueTopics: new Set(allData.map(d => d.topic).filter(Boolean)).size,
    uniqueCountries: new Set(allData.map(d => d.country).filter(Boolean)).size,
    avgIntensity: (allData.reduce((sum, d) => sum + (d.intensity || 0), 0) / allData.length).toFixed(2),
    avgLikelihood: (allData.reduce((sum, d) => sum + (d.likelihood || 0), 0) / allData.length).toFixed(2),
    avgRelevance: (allData.reduce((sum, d) => sum + (d.relevance || 0), 0) / allData.length).toFixed(2),
  };

  // Top performers
  const topSector = Object.entries(
    allData.reduce((acc, d) => {
      if (d.sector) acc[d.sector] = (acc[d.sector] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  const topRegion = Object.entries(
    allData.reduce((acc, d) => {
      if (d.region) acc[d.region] = (acc[d.region] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  const topTopic = Object.entries(
    allData.reduce((acc, d) => {
      if (d.topic) acc[d.topic] = (acc[d.topic] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  const handleExportCSV = () => {
    if (allData.length === 0) return;

    const headers = Object.keys(allData[0]);
    const csvContent = [
      headers.join(','),
      ...allData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (allData.length === 0) return;

    const jsonContent = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Reports & Export</h1>
          <p className="text-muted-foreground">
            Comprehensive summaries and data export options
          </p>
        </div>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Download your filtered data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={handleExportCSV} disabled={isLoading || allData.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button onClick={handleExportJSON} disabled={isLoading || allData.length === 0} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as JSON
            </Button>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
            <CardDescription>Key metrics and insights from your data</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading summary...</div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Unique Sectors</p>
                    <p className="text-2xl font-bold">{stats.uniqueSectors}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Unique Regions</p>
                    <p className="text-2xl font-bold">{stats.uniqueRegions}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Unique Topics</p>
                    <p className="text-2xl font-bold">{stats.uniqueTopics}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Average Metrics</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg Intensity</p>
                      <p className="text-xl font-semibold">{stats.avgIntensity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg Likelihood</p>
                      <p className="text-xl font-semibold">{stats.avgLikelihood}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg Relevance</p>
                      <p className="text-xl font-semibold">{stats.avgRelevance}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Top Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{topSector[0]}</p>
                  <p className="text-sm text-muted-foreground">
                    {topSector[1].toLocaleString()} records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{topRegion[0]}</p>
                  <p className="text-sm text-muted-foreground">
                    {topRegion[1].toLocaleString()} records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Top Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold truncate" title={topTopic[0]}>
                    {topTopic[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {topTopic[1].toLocaleString()} records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Applied Filters Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Applied Filters</CardTitle>
            <CardDescription>Current filter configuration for this report</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(selectedFilters).length === 0 ? (
              <p className="text-muted-foreground">No filters applied - showing all data</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([key, value]) => (
                  <div key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    <span className="font-medium capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}