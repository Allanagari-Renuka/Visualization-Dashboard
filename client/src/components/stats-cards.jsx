// StatsCards.jsx
import { TrendingUp, Globe, Building2, Activity, BarChart3, FileText, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards({ data, isLoading }) {
  const stats = [
    {
      title: "Total Records",
      value: data.length.toLocaleString(),
      icon: FileText,
      color: "bg-primary/10 text-primary",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Countries",
      value: new Set(data.filter(d => d.country).map(d => d.country)).size.toString(),
      icon: Globe,
      color: "bg-chart-2/10 text-chart-2",
      trend: "+3.2%",
      trendUp: true,
    },
    {
      title: "Sectors",
      value: new Set(data.filter(d => d.sector).map(d => d.sector)).size.toString(),
      icon: Building2,
      color: "bg-chart-3/10 text-chart-3",
      trend: "+5.8%",
      trendUp: true,
    },
    {
      title: "Topics",
      value: new Set(data.filter(d => d.topic).map(d => d.topic)).size.toString(),
      icon: Activity,
      color: "bg-chart-4/10 text-chart-4",
      trend: "+8.1%",
      trendUp: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="overflow-hidden hover-elevate transition-all duration-200"
          data-testid={`stat-card-${index}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate" data-testid={`stat-title-${index}`}>
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </h3>
                  <span className={`text-xs font-medium ${stat.trendUp ? "text-green-500" : "text-red-500"}`} data-testid={`stat-trend-${index}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}