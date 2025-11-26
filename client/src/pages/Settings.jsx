// pages/settings.js
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Globe, Lock, Palette, Database, Mail } from "lucide-react";
import { useNotifications } from "@/lib/notification-context";

export default function Settings() {
  const { pushEnabled, setPushEnabled } = useNotifications();
  const [notifications, setNotifications] = useState({
    email: true,
    push: pushEnabled,
    dataUpdates: true,
    weeklyReports: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    chartColorScheme: "default",
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: "sk_test_••••••••••••••••",
    refreshRate: "30",
    cacheEnabled: true,
  });

  const handleSave = (section) => {
    // Simulate save
    alert(`${section} settings saved successfully!`);
  };

  // Keep local toggle in sync with global push notification state
  useEffect(() => {
    setNotifications((prev) => ({ ...prev, push: pushEnabled }));
  }, [pushEnabled]);

  const handleRegenerateKey = () => {
    const randomPart = Math.random().toString(36).slice(2, 10);
    setApiSettings((prev) => ({
      ...prev,
      apiKey: `sk_live_${randomPart}`,
    }));
  };

  const handleClearCache = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
      }
    } catch (e) {
      // ignore storage errors
    }
    alert("Cache cleared successfully!");
  };

  const handleExportAllData = async () => {
    try {
      const res = await fetch("/jsondata_1764134621611.json");
      if (!res.ok) throw new Error("Failed to fetch data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dashboard-data.json";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export data");
    }
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      push: pushEnabled,
      dataUpdates: true,
      weeklyReports: true,
    });
    setPreferences({
      theme: "light",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      chartColorScheme: "default",
    });
    setApiSettings({
      apiKey: "sk_test_••••••••••••••••",
      refreshRate: "30",
      cacheEnabled: true,
    });
    alert("Settings have been reset to their defaults.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and configurations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API & Data</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>
                  Configure your basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={preferences.language} onValueChange={(val) => setPreferences({...preferences, language: val})}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(val) => setPreferences({...preferences, timezone: val})}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST (Eastern)</SelectItem>
                      <SelectItem value="PST">PST (Pacific)</SelectItem>
                      <SelectItem value="IST">IST (India)</SelectItem>
                      <SelectItem value="JST">JST (Japan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(val) => setPreferences({...preferences, dateFormat: val})}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => handleSave("General")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(val) => setNotifications({...notifications, email: val})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(val) => {
                      setNotifications({ ...notifications, push: val });
                      setPushEnabled(val);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new data is available
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.dataUpdates} 
                    onCheckedChange={(val) => setNotifications({...notifications, dataUpdates: val})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyReports} 
                    onCheckedChange={(val) => setNotifications({...notifications, weeklyReports: val})}
                  />
                </div>

                <Button onClick={() => handleSave("Notifications")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API & Data */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  API & Data Settings
                </CardTitle>
                <CardDescription>
                  Configure API access and data management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      value={apiSettings.apiKey}
                      readOnly
                    />
                    <Button variant="outline" onClick={handleRegenerateKey}>
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refresh-rate">Data Refresh Rate (seconds)</Label>
                  <Input 
                    id="refresh-rate" 
                    type="number" 
                    value={apiSettings.refreshRate}
                    onChange={(e) => setApiSettings({...apiSettings, refreshRate: e.target.value})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Data Caching</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache data locally for faster performance
                    </p>
                  </div>
                  <Switch 
                    checked={apiSettings.cacheEnabled} 
                    onCheckedChange={(val) => setApiSettings({...apiSettings, cacheEnabled: val})}
                  />
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h3 className="font-medium">Data Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClearCache}>Clear Cache</Button>
                    <Button variant="outline" onClick={handleExportAllData}>Export All Data</Button>
                    <Button variant="destructive" onClick={handleResetSettings}>Reset Settings</Button>
                  </div>
                </div>

                <Button onClick={() => handleSave("API")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}