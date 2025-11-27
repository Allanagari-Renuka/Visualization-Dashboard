import express from "express";
import { registerRoutes } from "./routes.js";

export function log(message, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default async function runApp(setup) {
  const server = await registerRoutes(app);

  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ message: err.message });
    console.error(err);
  });

  await setup(app, server);

  const port = Number(process.env.PORT || 5001);

  // FIX: Do NOT start server twice
  if (!server.listening) {
    server.listen(port, () => {
      log(`serving on http://localhost:${port}`);
    });
  }

  return server;
}
