// FilterPanel.jsx
import { X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilters } from "@/lib/filter-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function FilterPanel({ open, onClose }) {
  const { filters, selectedFilters, updateFilter, clearFilters } = useFilters();

  const filterConfigs = [
    { key: "end_year", label: "End Year", placeholder: "Select year" },
    { key: "topic", label: "Topic", placeholder: "Select topic" },
    { key: "sector", label: "Sector", placeholder: "Select sector" },
    { key: "region", label: "Region", placeholder: "Select region" },
    { key: "pestle", label: "PESTLE", placeholder: "Select PESTLE" },
    { key: "source", label: "Source", placeholder: "Select source" },
    { key: "swot", label: "SWOT", placeholder: "Select SWOT" },
    { key: "country", label: "Country", placeholder: "Select country" },
    { key: "city", label: "City", placeholder: "Select city" },
  ];

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0" data-testid="filter-panel">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-6">
            {filterConfigs.map((config) => {
              const options = filters?.[config.key] || [];
              const filteredOptions = options
                .filter((opt) => opt !== "" && opt !== null && opt !== undefined)
                .map((opt) => String(opt));
              const uniqueOptions = [...new Set(filteredOptions)].sort();

              return (
                <div key={config.key} className="space-y-2">
                  <Label
                    htmlFor={config.key}
                    className="text-sm font-medium text-foreground"
                  >
                    {config.label}
                  </Label>
                  <Select
                    value={selectedFilters[config.key] || ""}
                    onValueChange={(value) =>
                      updateFilter(config.key, value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger
                      id={config.key}
                      className="w-full"
                      data-testid={`select-${config.key}`}
                    >
                      <SelectValue placeholder={config.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {config.label}s</SelectItem>
                      {uniqueOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={clearFilters}
              data-testid="button-clear-filters"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={onClose}
              data-testid="button-apply-filters"
            >
              <Check className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}