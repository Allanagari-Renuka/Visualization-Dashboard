import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { FilterProvider } from "@/lib/filter-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Charts from "@/pages/charts";
import Data from "@/pages/data";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/charts" component={Charts} />
      <Route path="/data" component={Data} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dataviz-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <FilterProvider>
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Router />
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </FilterProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
