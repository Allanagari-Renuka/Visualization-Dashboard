# Design Guidelines: Analytics Dashboard Application

## Design Approach
**System-Based Approach**: Drawing from Material Design and modern dashboard patterns, with explicit inspiration from **Vuexy Admin Template** (https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/)

## Core Design Principles

### Layout Architecture
- **Dark-themed sidebar** (fixed, left-aligned) - 260px width on desktop
- **Top navbar** with filters and user controls
- **Main content area** with cards grid and chart sections
- **Responsive breakpoints**: Mobile stacks vertically, tablet reduces sidebar to icons-only, desktop shows full layout

### Typography System
- **Font Family**: Inter or System UI stack via Google Fonts
- **Hierarchy**:
  - Page titles: 2xl (24px), semi-bold
  - Card titles: lg (18px), medium
  - Body text: base (16px), regular
  - Chart labels: sm (14px), regular
  - Filter labels: sm (14px), medium

### Spacing System
**Tailwind units**: Consistently use 4, 6, 8, 12, 16 for spacing
- Card padding: p-6
- Section margins: mb-8
- Grid gaps: gap-6
- Component spacing: space-y-4

## Component Library

### Navigation Components
1. **Sidebar**
   - Dark background (#1e293b or similar)
   - Logo at top (h-16)
   - Navigation items with icons (Heroicons)
   - Active state with accent color border/background
   - Collapsed state showing only icons on tablet

2. **Top Navbar**
   - Light background with shadow
   - Search bar (left)
   - Filter toggle button
   - User avatar and notifications (right)
   - Height: h-16

### Dashboard Components
1. **Statistics Cards**
   - 4 cards in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
   - White background with subtle shadow
   - Icon circle (top-left or left)
   - Large number display
   - Label text below
   - Subtle hover lift effect

2. **Filter Panel**
   - Collapsible panel/drawer
   - 9 filter controls in 2-column grid on desktop:
     - End Year (dropdown)
     - Topics (multi-select with checkboxes)
     - Sector (multi-select)
     - Region (dropdown)
     - PESTLE (dropdown)
     - Source (dropdown)
     - SWOT (dropdown)
     - Country (dropdown)
     - City (dropdown)
   - "Apply Filters" and "Reset" buttons at bottom
   - Smooth slide-in animation

3. **Chart Grid**
   - Responsive grid: grid-cols-1 lg:grid-cols-2
   - Each chart in white card with p-6
   - Chart title at top (text-lg font-medium)
   - Chart area with min-height (h-64 or h-80)
   - 9 charts total:
     - Intensity vs Year (line chart)
     - Likelihood Distribution (bar chart)
     - Relevance Distribution (bar chart)
     - Country-wise Insights (horizontal bar)
     - Region-wise Data (pie/donut chart)
     - Topic Frequency (bar chart)
     - PEST Analysis (grouped bar)
     - SWOT Heatmap (heatmap visualization)
     - City-wise Impact (bubble/scatter chart)

4. **Data Table**
   - Full-width table with sticky header
   - Sortable columns
   - Pagination controls (bottom)
   - Row hover state
   - Alternating row backgrounds for readability
   - Responsive: horizontal scroll on mobile

### Interactive Elements
- **Buttons**: Rounded corners (rounded-lg), shadow on hover, smooth transitions
- **Dropdowns**: Clean design with icons, max-height with scroll for long lists
- **Multi-select**: Checkboxes with search functionality
- **Cards**: Subtle shadow (shadow-sm), hover shadow increase (hover:shadow-md)

## Visual Treatments
- **Shadows**: Use sparingly - sm for cards, md for modals
- **Borders**: Subtle gray borders (border-gray-200) where needed
- **Transitions**: All interactive elements use transition-all duration-200
- **Hover States**: Slight scale (scale-105) or shadow increase, never color-only

## Animations
- **Minimal and purposeful**
- Sidebar collapse/expand: smooth width transition
- Filter panel: slide-in from right
- Chart data updates: subtle fade-in
- Card hover: gentle lift (transform translateY(-2px))
- NO loading spinners for charts - use skeleton screens

## Responsive Behavior
- **Mobile (< 768px)**: Sidebar converts to hamburger menu, charts stack vertically, filters become full-screen modal
- **Tablet (768px - 1024px)**: Icon-only sidebar, 2-column chart grid
- **Desktop (> 1024px)**: Full layout with 2-column charts, expanded sidebar

## Images
No hero images or decorative images needed - this is a data-focused dashboard application prioritizing charts, tables, and functional UI components.