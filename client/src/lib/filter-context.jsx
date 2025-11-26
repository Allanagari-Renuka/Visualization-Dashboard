// lib/filter-context.js
import { createContext, useContext, useState, useCallback } from "react";

const FilterContext = createContext(undefined);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const updateFilter = useCallback((key, value) => {
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