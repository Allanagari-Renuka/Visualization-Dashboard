import { Bell, Search, Filter, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onFilterToggle?: () => void;
  showFilterButton?: boolean;
}

export function Navbar({ onFilterToggle, showFilterButton = true }: NavbarProps) {
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

        <Button variant="ghost" size="icon" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
              data-testid="button-user-menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  DV
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Data Analyst</p>
                <p className="text-xs text-muted-foreground">analyst@dataviz.pro</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-item-profile">Profile</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-item-settings">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-item-logout">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
