// server/routes.js

import { createServer } from "http";
import { storage } from "./storage.js";

export async function registerRoutes(app) {
  app.get("/api/data", async (req, res) => {
    res.json(await storage.getAllData());
  });

  app.get("/api/filters", async (req, res) => {
    res.json(await storage.getFilters());
  });

  app.get("/api/data/filter", async (req, res) => {
    const filtered = await storage.getFilteredData(req.query);
    res.json(filtered);
  });

  return createServer(app);
}
