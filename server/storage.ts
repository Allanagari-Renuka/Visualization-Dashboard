import { randomUUID } from "crypto";
import type { DataRecord, Filters, FilterQuery } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawDataRecord {
  end_year?: number | string;
  intensity?: number;
  sector?: string;
  topic?: string;
  insight?: string;
  url?: string;
  region?: string;
  start_year?: number | string;
  impact?: number | string;
  added?: string;
  published?: string;
  country?: string;
  relevance?: number;
  pestle?: string;
  source?: string;
  title?: string;
  likelihood?: number;
  city?: string;
  swot?: string;
}

export interface IStorage {
  getAllData(): Promise<DataRecord[]>;
  getFilters(): Promise<Filters>;
  getFilteredData(query: FilterQuery): Promise<DataRecord[]>;
}

export class MemStorage implements IStorage {
  private data: DataRecord[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const dataPath = path.join(__dirname, "data.json");
      const rawData = fs.readFileSync(dataPath, "utf-8");
      const jsonData: RawDataRecord[] = JSON.parse(rawData);

      this.data = jsonData.map((record, index) => ({
        id: randomUUID(),
        end_year: record.end_year,
        intensity: record.intensity,
        sector: record.sector || "",
        topic: record.topic || "",
        insight: record.insight || "",
        url: record.url || "",
        region: record.region || "",
        start_year: record.start_year,
        impact: record.impact,
        added: record.added || "",
        published: record.published || "",
        country: record.country || "",
        relevance: record.relevance,
        pestle: record.pestle || "",
        source: record.source || "",
        title: record.title || "",
        likelihood: record.likelihood,
        city: record.city || "",
        swot: record.swot || "",
      }));

      console.log(`Loaded ${this.data.length} records from JSON data`);
    } catch (error) {
      console.error("Failed to load data:", error);
      this.data = [];
    }
  }

  async getAllData(): Promise<DataRecord[]> {
    return this.data;
  }

  async getFilters(): Promise<Filters> {
    const filters: Filters = {
      end_year: [],
      topic: [],
      sector: [],
      region: [],
      pestle: [],
      source: [],
      swot: [],
      country: [],
      city: [],
    };

    const endYearSet = new Set<string | number>();
    const topicSet = new Set<string>();
    const sectorSet = new Set<string>();
    const regionSet = new Set<string>();
    const pestleSet = new Set<string>();
    const sourceSet = new Set<string>();
    const swotSet = new Set<string>();
    const countrySet = new Set<string>();
    const citySet = new Set<string>();

    this.data.forEach((record) => {
      if (record.end_year !== undefined && record.end_year !== "") {
        endYearSet.add(record.end_year);
      }
      if (record.topic) topicSet.add(record.topic);
      if (record.sector) sectorSet.add(record.sector);
      if (record.region) regionSet.add(record.region);
      if (record.pestle) pestleSet.add(record.pestle);
      if (record.source) sourceSet.add(record.source);
      if (record.swot) swotSet.add(record.swot);
      if (record.country) countrySet.add(record.country);
      if (record.city) citySet.add(record.city);
    });

    filters.end_year = Array.from(endYearSet).sort((a, b) => Number(a) - Number(b));
    filters.topic = Array.from(topicSet).sort();
    filters.sector = Array.from(sectorSet).sort();
    filters.region = Array.from(regionSet).sort();
    filters.pestle = Array.from(pestleSet).sort();
    filters.source = Array.from(sourceSet).sort();
    filters.swot = Array.from(swotSet).sort();
    filters.country = Array.from(countrySet).sort();
    filters.city = Array.from(citySet).sort();

    return filters;
  }

  async getFilteredData(query: FilterQuery): Promise<DataRecord[]> {
    return this.data.filter((record) => {
      if (query.end_year && String(record.end_year) !== query.end_year) {
        return false;
      }
      if (query.topic && record.topic !== query.topic) {
        return false;
      }
      if (query.sector && record.sector !== query.sector) {
        return false;
      }
      if (query.region && record.region !== query.region) {
        return false;
      }
      if (query.pestle && record.pestle !== query.pestle) {
        return false;
      }
      if (query.source && record.source !== query.source) {
        return false;
      }
      if (query.swot && record.swot !== query.swot) {
        return false;
      }
      if (query.country && record.country !== query.country) {
        return false;
      }
      if (query.city && record.city !== query.city) {
        return false;
      }
      return true;
    });
  }
}

export const storage = new MemStorage();
