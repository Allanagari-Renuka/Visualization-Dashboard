// lib/search-context.jsx
import { createContext, useContext, useState } from "react";

const SearchContext = createContext(undefined);

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        clearSearch: () => setSearchTerm(""),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return ctx;
}


