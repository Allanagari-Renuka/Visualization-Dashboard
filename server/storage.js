import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

class MemStorage {
  constructor() {
    this.data = [];
    this.loadData();
  }

  loadData() {
    try {
      const filepath = path.join(process.cwd(), "data.json");
      const content = fs.readFileSync(filepath, "utf-8");
      const json = JSON.parse(content);

      this.data = json.map((r) => ({
        id: randomUUID(),
        ...r,
        sector: r.sector || "",
        topic: r.topic || "",
        region: r.region || "",
        insight: r.insight || "",
        url: r.url || "",
        added: r.added || "",
        published: r.published || "",
        country: r.country || "",
        pestle: r.pestle || "",
        source: r.source || "",
        title: r.title || "",
        city: r.city || "",
        swot: r.swot || "",
      }));

      console.log(`Loaded ${this.data.length} records`);
    } catch (e) {
      console.error("Failed to load data:", e);
      this.data = [];
    }
  }

  async getAllData() {
    return this.data;
  }

  async getFilters() {
    const keys = ["end_year", "topic", "sector", "region", "pestle", "source", "swot", "country", "city"];
    const filters = {};

    keys.forEach((k) => (filters[k] = [...new Set(this.data.map((d) => d[k]).filter(Boolean))].sort()));

    return filters;
  }

  async getFilteredData(query) {
    return this.data.filter((r) => {
      for (const key in query) {
        if (query[key] && String(r[key]) !== String(query[key])) return false;
      }
      return true;
    });
  }
}

export const storage = new MemStorage();
