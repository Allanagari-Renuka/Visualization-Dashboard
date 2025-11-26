import { createContext, useContext, useState, useCallback } from "react";
import type { Filters, FilterQuery } from "@shared/schema";

type FilterContextType = {
  filters: Filters | null;
  selectedFilters: FilterQuery;
  setSelectedFilters: (filters: FilterQuery) => void;
  updateFilter: (key: keyof FilterQuery, value: string | undefined) => void;
  clearFilters: () => void;
  setFilters: (filters: Filters) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterQuery>({});

  const updateFilter = useCallback((key: keyof FilterQuery, value: string | undefined) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({});
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        selectedFilters,
        setSelectedFilters,
        updateFilter,
        clearFilters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
