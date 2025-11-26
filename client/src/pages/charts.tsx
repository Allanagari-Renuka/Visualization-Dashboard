import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { IntensityYearChart } from "@/components/charts/intensity-year-chart";
import { LikelihoodChart } from "@/components/charts/likelihood-chart";
import { RelevanceChart } from "@/components/charts/relevance-chart";
import { CountryChart } from "@/components/charts/country-chart";
import { RegionChart } from "@/components/charts/region-chart";
import { TopicChart } from "@/components/charts/topic-chart";
import { PestChart } from "@/components/charts/pest-chart";
import { SwotHeatmap } from "@/components/charts/swot-heatmap";
import { CityChart } from "@/components/charts/city-chart";
import { SectorChart } from "@/components/charts/sector-chart";
import { useFilters } from "@/lib/filter-context";
import type { DataRecord, Filters } from "@shared/schema";

export default function Charts() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { selectedFilters, setFilters } = useFilters();

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const { data: allData = [], isLoading: isDataLoading } = useQuery<DataRecord[]>({
    queryKey: ["/api/data/filter", selectedFilters],
    queryFn: async () => {
      const queryString = buildQueryString();
      const url = queryString ? `/api/data/filter?${queryString}` : "/api/data";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });

  const { isLoading: isFiltersLoading } = useQuery<Filters>({
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="charts-title">
            Charts & Insights
          </h1>
          <p className="text-muted-foreground">
            All visualizations and data analysis charts
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <IntensityYearChart data={allData} isLoading={isLoading} />
          <LikelihoodChart data={allData} isLoading={isLoading} />
          <RelevanceChart data={allData} isLoading={isLoading} />
          <CountryChart data={allData} isLoading={isLoading} />
          <RegionChart data={allData} isLoading={isLoading} />
          <TopicChart data={allData} isLoading={isLoading} />
          <PestChart data={allData} isLoading={isLoading} />
          <SwotHeatmap data={allData} isLoading={isLoading} />
          <CityChart data={allData} isLoading={isLoading} />
          <SectorChart data={allData} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
