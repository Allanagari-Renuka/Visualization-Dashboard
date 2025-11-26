import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  BarChart3,
  Table2,
  Settings,
  TrendingUp,
  Hash,
  FileBarChart,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Charts & Insights", url: "/charts", icon: BarChart3 },
  { title: "Data Table", url: "/data", icon: Table2 },
  { title: "Insights", url: "/insights", icon: Activity },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Topics", url: "/topics", icon: Hash },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r-0">
      {/* Logo Section */}
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <BarChart3 className="h-7 w-7 text-primary-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">
              DataVisualization
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Analytics Dashboard
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Menu with Bigger Spacing */}
      <SidebarContent className="px-5 py-8 space-y-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="
                      h-12                 /* taller buttons */
                      gap-4                /* more gap between icon + text */
                      rounded-xl 
                      px-5 
                      text-[15px] 
                      font-medium
                    "
                  >
                    <Link href={item.url}>
                      <item.icon className="h-6 w-6 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
