// pages/Notifications.jsx
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/notification-context";

export default function NotificationsPage() {
  const { items, markAllRead } = useNotifications();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View recent alerts and activity
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Latest in-app messages and updates
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {items.length} total
            </Badge>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no notifications yet.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-md border bg-card/50 px-3 py-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm">{item.message}</p>
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


