// pages/data.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { FilterPanel } from "@/components/filter-panel";
import { DataTable } from "@/components/data-table";
import { useFilters } from "@/lib/filter-context";
import { useSearch } from "@/lib/search-context";

export default function Data() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { selectedFilters, setFilters } = useFilters();
  const { searchTerm } = useSearch();

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onFilterToggle={() => setFilterOpen(true)} />
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="data-title">
            Data Table View
          </h1>
          <p className="text-muted-foreground">
            Browse, search and analyze all records
          </p>
        </div>

        <DataTable data={allData} isLoading={isLoading} globalSearchTerm={searchTerm} />
      </main>
    </div>
  );
}