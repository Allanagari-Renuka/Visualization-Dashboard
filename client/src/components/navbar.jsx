import { Link, useLocation } from "wouter";
import { Bell, Search, Filter, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/lib/notification-context";
import { useSearch } from "@/lib/search-context";

export function Navbar({ onFilterToggle, showFilterButton = true }) {
  const { hasUnread, markAllRead } = useNotifications();
  const { searchTerm, setSearchTerm } = useSearch();
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <SidebarTrigger data-testid="button-sidebar-toggle" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>

      <div className="hidden md:flex flex-1 items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data..."
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLocation("/data");
              }
            }}
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {showFilterButton && (
          <Button
            variant="outline"
            size="default"
            onClick={onFilterToggle}
            className="gap-2"
            data-testid="button-filter-toggle"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        )}

        <Link href="/notifications">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-notifications"
            onClick={markAllRead}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>

        <ThemeToggle />

        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
          data-testid="button-user-avatar"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://via.placeholder.com/40x40.png"
              alt="User"
            />
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://randomuser.me/api/portraits/women/65.jpg"  
                alt="User"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                D
              </AvatarFallback>
            </Avatar>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}