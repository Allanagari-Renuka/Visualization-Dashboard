import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nanoid } from "nanoid";
import runApp from "./app.js";
import viteConfig from "../vite.config.js";
import { fileURLToPath } from "url";

// Fix Windows dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app, server) {
  const vite = await createViteServer({
    ...viteConfig,
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  // Attach Vite middleware
  app.use(vite.middlewares);

  // Serve index.html
  app.use("*", async (req, res, next) => {
    try {
      const indexPath = path.resolve(__dirname, "../client/index.html");

      let template = await fs.promises.readFile(indexPath, "utf8");

      template = template.replace(
        `/src/main.jsx`,
        `/src/main.jsx?v=${nanoid()}`
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
