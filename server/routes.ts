import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/data", async (req, res) => {
    try {
      const data = await storage.getAllData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  app.get("/api/filters", async (req, res) => {
    try {
      const filters = await storage.getFilters();
      res.json(filters);
    } catch (error) {
      console.error("Error fetching filters:", error);
      res.status(500).json({ error: "Failed to fetch filters" });
    }
  });

  app.get("/api/data/filter", async (req, res) => {
    try {
      const query = {
        end_year: req.query.end_year as string | undefined,
        topic: req.query.topic as string | undefined,
        sector: req.query.sector as string | undefined,
        region: req.query.region as string | undefined,
        pestle: req.query.pestle as string | undefined,
        source: req.query.source as string | undefined,
        swot: req.query.swot as string | undefined,
        country: req.query.country as string | undefined,
        city: req.query.city as string | undefined,
      };

      Object.keys(query).forEach((key) => {
        if (query[key as keyof typeof query] === undefined) {
          delete query[key as keyof typeof query];
        }
      });

      const data = await storage.getFilteredData(query);
      res.json(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      res.status(500).json({ error: "Failed to fetch filtered data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
