# 📊 Visualization Dashboard

A modern, interactive data visualization dashboard built with React, Node.js, and Drizzle ORM. Transform complex datasets into beautiful, insightful visualizations with real-time updates and dynamic filtering capabilities.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://visualization-dashboard-fawn.vercel.app)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple?logo=vite)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

## 🌟 Live Demo

**🚀 [View Dashboard](https://visualization-dashboard-fawn.vercel.app)**

## ✨ Features

- 📊 **Multiple Chart Types** - Line, Bar, Pie, Area, and more
- 🎯 **Interactive Visualizations** - Hover, click, and filter data dynamically
- 🔄 **Real-time Updates** - Live data refresh and synchronization
- 🎨 **Customizable Themes** - Dark/Light mode with custom color palettes
- 📱 **Responsive Design** - Perfect viewing on all devices
- 🔍 **Advanced Filtering** - Filter and search through datasets
- 📈 **Data Analytics** - Statistical insights and trend analysis
- 💾 **Data Export** - Download visualizations as images or data as CSV
- 🔐 **Secure Backend** - RESTful API with authentication
- ⚡ **High Performance** - Optimized rendering with Vite and React

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18.3.1** - UI library
- **Vite 6.0.1** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Recharts / D3.js** - Data visualization libraries
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database (or your DB choice)
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

### Shared
- **Type Definitions** - Shared types between client and server
- **Validation Schemas** - Data validation utilities

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Drizzle Kit** - Database migrations

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (or your preferred database)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Allanagari-Renuka/Visualization-Dashboard.git
cd Visualization-Dashboard
```

### 2. Install Dependencies

Install root dependencies and dependencies for both client and server:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
```

### 3. Set Up Database

#### Configure Drizzle

Edit `drizzle.config.js` with your database credentials:

```javascript
export default {
  schema: "./server/db/schema.js",
  out: "./server/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
};
```

#### Run Migrations

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Optional: Seed database with sample data
npm run db:seed
```

### 4. Configure Environment Variables

Create `.env` files in both client and server directories:

**Server `.env` (server/.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dashboard_db
PORT=3001
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Client `.env` (client/.env):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Visualization Dashboard
```

### 5. Start Development Servers

#### Option A: Run Both Servers Simultaneously

```bash
npm run dev
```

#### Option B: Run Separately

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend client
cd client
npm run dev
```

The application will be available at:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`

## 📦 Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server concurrently |
| `npm run build` | Build both client and server |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |

### Client Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |

## 🏗️ Project Structure

```
Visualization-Dashboard/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── charts/   # Chart components
│   │   │   └── layout/   # Layout components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── styles/       # Global styles
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Application entry
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Client dependencies
├── server/               # Backend Node.js application
│   ├── db/
│   │   ├── schema.js     # Database schema
│   │   ├── migrations/   # Database migrations
│   │   └── index.js      # Database connection
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── data.js       # Data endpoints
│   │   └── analytics.js  # Analytics endpoints
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Auth middleware
│   │   └── error.js      # Error handling
│   ├── controllers/      # Route controllers
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── index.js          # Server entry point
│   └── package.json      # Server dependencies
├── shared/               # Shared code between client/server
│   ├── types/            # TypeScript types
│   ├── schemas/          # Validation schemas
│   └── constants/        # Shared constants
├── data.json             # Sample data file
├── components.json       # shadcn/ui configuration
├── drizzle.config.js     # Drizzle ORM configuration
├── jsconfig.json         # JavaScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Root dependencies
```

## 🎯 Key Features Explained

### Dynamic Chart Rendering

The dashboard supports multiple chart types with dynamic data binding:

```javascript
import { LineChart, BarChart, PieChart } from './components/charts';

<LineChart 
  data={chartData}
  xAxis="date"
  yAxis="value"
  theme="dark"
/>
```

### Real-time Data Updates

WebSocket integration for live data streaming:

```javascript
// Server-side WebSocket setup
io.on('connection', (socket) => {
  socket.on('subscribe', (dataSource) => {
    // Stream data updates
  });
});
```

### Advanced Filtering

Filter data across multiple dimensions:

```javascript
const filteredData = useFilter({
  dateRange: [startDate, endDate],
  categories: selectedCategories,
  minValue: 0,
  maxValue: 1000
});
```

### Data Export

Export visualizations and data in multiple formats:

```javascript
// Export as PNG
exportToPNG(chartRef);

// Export as CSV
exportToCSV(dataSet, 'filename.csv');

// Export as PDF
exportToPDF(dashboardRef);
```

## 🎨 Customization

### Theme Configuration

Customize colors and themes in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

### Chart Customization

Customize chart appearance:

```javascript
const chartConfig = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  animations: true,
  responsive: true,
  legend: {
    position: 'bottom',
  },
};
```

### Dashboard Layout

Create custom dashboard layouts:

```javascript
<DashboardGrid>
  <GridItem span={2}>
    <ChartCard title="Revenue">
      <LineChart data={revenueData} />
    </ChartCard>
  </GridItem>
  <GridItem span={1}>
    <MetricCard value={totalUsers} label="Total Users" />
  </GridItem>
</DashboardGrid>
```

## 📊 Data Sources

### JSON Data Format

The dashboard accepts data in the following format:

```json
{
  "datasets": [
    {
      "id": "revenue",
      "label": "Monthly Revenue",
      "data": [
        { "date": "2024-01", "value": 12500 },
        { "date": "2024-02", "value": 15300 }
      ]
    }
  ]
}
```

### API Integration

Connect to external data sources:

```javascript
// client/src/services/api.js
export const fetchDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard/data`);
  return response.data;
};
```

### Database Queries

Using Drizzle ORM for type-safe queries:

```javascript
// server/db/queries.js
export const getAnalytics = async (dateRange) => {
  return await db
    .select()
    .from(analytics)
    .where(between(analytics.date, dateRange.start, dateRange.end));
};
```

## 🔐 Authentication

The dashboard includes JWT-based authentication:

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Protected routes require Authorization header
headers: {
  'Authorization': 'Bearer <token>'
}
```

## 🚀 Deployment

### Deploy to Vercel

The project is optimized for Vercel deployment:

#### Deploy Frontend

```bash
cd client
vercel
```

#### Deploy Backend

```bash
cd server
vercel
```

#### Environment Variables

Add these to your Vercel project:

**Frontend:**
- `VITE_API_URL` - Your backend API URL

**Backend:**
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - production

### Deploy to Other Platforms

#### Heroku

```bash
# Backend deployment
heroku create dashboard-api
heroku addons:create heroku-postgresql
git push heroku main

# Frontend deployment
cd client
heroku create dashboard-client
heroku buildpacks:set heroku/nodejs
git push heroku main
```

#### Docker

```dockerfile
# Multi-stage build
FROM node:18-alpine as build

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

# Build backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server ./

# Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server ./server
WORKDIR /app/server
CMD ["npm", "start"]
```

## 📈 Performance Optimization

### Code Splitting

Implemented with React.lazy and Suspense:

```javascript
const ChartDashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <ChartDashboard />
</Suspense>
```

### Caching Strategy

- **API responses:** Redis caching
- **Static assets:** CDN caching
- **Database queries:** Query result caching

### Bundle Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts', 'd3'],
        },
      },
    },
  },
};
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run with coverage
npm run test:coverage
```

## 🔧 Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string in .env
echo $DATABASE_URL
```

**Port conflicts:**
```bash
# Change ports in .env files
# Client: VITE_PORT=5174
# Server: PORT=3002
```

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Contributors

- **Renuka Allanagari** - [@Allanagari-Renuka](https://github.com/Allanagari-Renuka)
- **Contributors** - [View all contributors](https://github.com/Allanagari-Renuka/Visualization-Dashboard/graphs/contributors)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Recharts](https://recharts.org/) - Chart library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

Need help? Here's how to get support:

- 📧 Open an [issue](https://github.com/Allanagari-Renuka/Visualization-Dashboard/issues)
- 💬 Check [existing issues](https://github.com/Allanagari-Renuka/Visualization-Dashboard/issues)
- 📖 Review the documentation

## 🗺️ Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced data analytics with ML insights
- [ ] Custom dashboard builder (drag-and-drop)
- [ ] Mobile app (React Native)
- [ ] More chart types (Sankey, Treemap, Heatmap)
- [ ] Data source connectors (SQL, MongoDB, APIs)
- [ ] Scheduled reports and email notifications
- [ ] White-label customization
- [ ] Multi-tenant support
- [ ] Advanced user permissions and roles
- [ ] Data transformation pipelines
- [ ] API rate limiting and quotas
- [ ] Audit logs and compliance features
- [ ] Integration with BI tools (Tableau, Power BI)
- [ ] GraphQL API support

## 📚 API Documentation

### Endpoints

#### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/refresh     - Refresh token
POST   /api/auth/logout      - Logout user
```

#### Dashboard Data
```
GET    /api/dashboard        - Get dashboard overview
GET    /api/dashboard/:id    - Get specific dashboard
POST   /api/dashboard        - Create new dashboard
PUT    /api/dashboard/:id    - Update dashboard
DELETE /api/dashboard/:id    - Delete dashboard
```

#### Analytics
```
GET    /api/analytics        - Get analytics data
GET    /api/analytics/export - Export analytics
POST   /api/analytics/query  - Custom analytics query
```

## 📊 Sample Data Structure

The `data.json` file contains sample datasets:

```json
{
  "revenue": [...],
  "users": [...],
  "products": [...],
  "traffic": [...]
}
```

Import this data to populate your dashboard with sample visualizations.

---

⭐ **Star this repository if you find it helpful!**

🔗 **[Visit Live Demo](https://visualization-dashboard-fawn.vercel.app)**
