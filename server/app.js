// server/app.js

import express from "express";
import { registerRoutes } from "./routes.js";

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Log API responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse;
  const originalJson = res.json;

  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";

      log(logLine);
    }
  });

  next();
});

// MAIN SERVER BOOT
export default async function runApp(setup) {
  const server = await registerRoutes(app);

  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    console.error(err);
  });

  await setup(app, server);

  const port = Number(process.env.PORT || 5000);

  server.listen(port, () => {
    log(`serving on http://localhost:${port}`);
  });
}
