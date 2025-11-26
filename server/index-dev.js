// server/index-dev.js

import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nanoid } from "nanoid";
import runApp from "./app.js";
import viteConfig from "../vite.config.js";

// IMPORTANT FIX FOR WINDOWS
const dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'));

export async function setupVite(app, server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const clientFile = path.join(dirname, "..", "client", "index.html");

      let template = await fs.promises.readFile(clientFile, "utf8");

      template = template.replace(
        `src="/src/main.jsx"`,
        `src="/src/main.jsx?v=${nanoid()}"`
      );

      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

(async () => {
  await runApp(setupVite);
})();
