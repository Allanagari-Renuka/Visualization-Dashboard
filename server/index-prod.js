// server/serve-static.js

import fs from "fs";
import path from "path";
import express from "express";
import runApp from "./app.js";

const dirname = path.dirname(new URL(import.meta.url).pathname);

export async function serveStatic(app, _server) {
  const distPath = path.resolve(dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static files
  app.use(express.static(distPath));

  // Fallback: always return index.html for SPA routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
