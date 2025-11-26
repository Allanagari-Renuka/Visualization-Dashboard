# DataViz Pro - Analytics Dashboard

## Overview

DataViz Pro is a comprehensive data visualization dashboard web application built to provide interactive analytics and insights. The application visualizes JSON data through multiple chart types, advanced filtering capabilities, and tabular data views. It features a modern dark-themed interface with responsive design patterns inspired by Material Design and the Vuexy Admin Template.

The application processes analytical data containing metrics across various dimensions including sectors, regions, countries, topics, PESTLE factors, and SWOT analysis, enabling users to explore trends, distributions, and relationships through 9+ interactive visualizations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack React Query (v5) for server state management and data fetching

**UI Component Strategy**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows "New York" style variant from shadcn
- Custom theme system supporting light/dark modes with CSS variables
- Responsive breakpoints: mobile (stacked), tablet (icon-only sidebar), desktop (full layout)

**State Management Approach**
- React Context API for theme management (`ThemeProvider`)
- React Context API for filter state (`FilterProvider`)
- TanStack Query for server state caching and synchronization
- Local component state using React hooks

**Data Visualization**
- Recharts library for all chart components
- 9+ chart types: Line charts, bar charts, pie charts, scatter plots, heatmaps
- Custom chart components wrapper pattern for consistent styling
- Responsive containers with custom tooltips and legends

**Routing Structure**
- `/` - Dashboard page (overview with key stats and primary charts)
- `/charts` - Charts & Insights page (comprehensive visualization gallery)
- `/data` - Data Table page (sortable, searchable, paginated table view)
- `/404` - Not Found fallback

### Backend Architecture

**Server Framework**
- Express.js (Node.js) with TypeScript
- ESM module system throughout
- Development mode: tsx with Vite middleware integration
- Production mode: esbuild bundled output

**Data Storage Strategy**
- In-memory storage implementation (`MemStorage` class)
- JSON file-based data source (`server/data.json`)
- Data loaded at server startup and kept in memory
- No database currently configured (MongoDB mentioned in requirements but not implemented)
- Drizzle ORM configured for future PostgreSQL integration

**API Design**
- RESTful endpoints following standard conventions
- `GET /api/data` - Returns all data records
- `GET /api/filters` - Returns unique filter values for all dimensions
- `GET /api/data/filter?[params]` - Returns filtered data based on query parameters

**Data Validation**
- Zod schemas for runtime type validation
- Shared schemas between client and server (`shared/schema.ts`)
- Type inference from Zod schemas for TypeScript types

**Development Features**
- Request/response logging middleware
- Hot module replacement in development
- Replit-specific plugins for enhanced DX (error overlay, cartographer, dev banner)

### Design System

**Typography**
- Font families: Inter/System UI for primary text, Fira Code/Geist Mono for code
- Hierarchy: 2xl (page titles), lg (card titles), base (body), sm (labels)

**Spacing System**
- Consistent Tailwind units: 4, 6, 8, 12, 16
- Card padding: p-6
- Section margins: mb-8
- Grid gaps: gap-6

**Color Tokens**
- HSL-based color system with CSS custom properties
- Separate tokens for light/dark modes
- Chart colors: 6 distinct hues (chart-1 through chart-6)
- Semantic colors: primary, secondary, muted, accent, destructive

**Component Patterns**
- Card-based layouts with consistent shadows and borders
- Sidebar: 260px width (desktop), icon-only (tablet), hidden (mobile)
- Top navbar: 64px height with search, filters, theme toggle, user menu
- Stats cards: Grid layout (1/2/4 columns responsive)

### External Dependencies

**Core Libraries**
- `@radix-ui/*` - 20+ headless UI components for accessibility
- `react-hook-form` + `@hookform/resolvers` - Form management
- `recharts` - Chart visualization library
- `date-fns` - Date manipulation utilities
- `class-variance-authority` + `clsx` + `tailwind-merge` - Dynamic className utilities
- `cmdk` - Command palette component
- `embla-carousel-react` - Carousel component
- `wouter` - Lightweight routing

**Backend Libraries**
- `express` - HTTP server framework
- `drizzle-orm` + `drizzle-kit` - ORM for future database integration
- `@neondatabase/serverless` - Neon Postgres driver
- `connect-pg-simple` - PostgreSQL session store (configured but unused)
- `nanoid` - Unique ID generation
- `zod` - Schema validation

**Build & Development Tools**
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `typescript` - Type checking
- `tsx` - TypeScript execution
- `esbuild` - Production bundling
- `tailwindcss` + `autoprefixer` + `postcss` - CSS processing
- `@replit/*` - Replit-specific development plugins

**Database Configuration**
- Drizzle ORM configured for PostgreSQL dialect
- Connection via `DATABASE_URL` environment variable
- Schema location: `shared/schema.ts`
- Migrations output: `./migrations`
- Note: Currently using in-memory storage; database infrastructure ready but not actively used

**Future Integration Points**
- MongoDB mentioned in project requirements but not implemented
- PostgreSQL infrastructure configured via Drizzle but not utilized
- Session management configured but not implemented