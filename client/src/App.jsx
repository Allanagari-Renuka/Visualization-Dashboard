import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { FilterProvider } from "@/lib/filter-context";
import { NotificationProvider } from "@/lib/notification-context";
import { SearchProvider } from "@/lib/search-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Charts from "@/pages/charts";
import Data from "@/pages/data";
import Insights from "@/pages/Insights";
import Trends from "@/pages/Trends";
import Topics from "@/pages/Topics";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/charts" component={Charts} />
      <Route path="/data" component={Data} />
      <Route path="/insights" component={Insights} />
      <Route path="/trends" component={Trends} />
      <Route path="/topics" component={Topics} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/notifications" component={Notifications} />
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
          <NotificationProvider>
            <FilterProvider>
              <SearchProvider>
                <SidebarProvider style={sidebarStyle}>
                  <div className="flex h-screen w-full overflow-hidden">
                    <AppSidebar />
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <Router />
                    </div>
                  </div>
                </SidebarProvider>
                <Toaster />
              </SearchProvider>
            </FilterProvider>
          </NotificationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;