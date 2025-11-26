import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataRecord } from "@shared/schema";

interface TopicChartProps {
  data: DataRecord[];
  isLoading?: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

export function TopicChart({ data, isLoading }: TopicChartProps) {
  const chartData = useMemo(() => {
    const topicMap = new Map<string, number>();

    data.forEach((record) => {
      if (record.topic && record.topic.trim()) {
        const count = topicMap.get(record.topic) || 0;
        topicMap.set(record.topic, count + 1);
      }
    });

    return Array.from(topicMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid="chart-topic">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" data-testid="chart-topic-title">Topic Frequency</CardTitle>
        <CardDescription data-testid="chart-topic-desc">Most frequently discussed topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" data-testid="chart-topic-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="topic"
                tick={{ fontSize: 11, angle: -45, textAnchor: "end" }}
                className="text-muted-foreground"
                height={60}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="count" name="Frequency" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
