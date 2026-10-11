import { createServer } from "node:http";
import { app } from "./app";
import { config } from "./config/env";

const server = createServer(app);
let shuttingDown = false;

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error(`Unable to start HTTP server: ${error.message}`);
  process.exitCode = 1;
});

server.listen(config.port, config.host, () => {
  console.log(`API listening on http://${config.host}:${config.port}`);
});

function shutdown(signal: NodeJS.Signals): void {
  if (shuttingDown) {
    server.closeAllConnections();
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received; closing HTTP server.`);

  const forceCloseTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out; closing active connections.");
    process.exitCode = 1;
    server.closeAllConnections();
  }, 10_000);
  forceCloseTimer.unref();

  server.close((error) => {
    clearTimeout(forceCloseTimer);
    if (error) {
      console.error("Unable to close HTTP server cleanly:", error);
      process.exitCode = 1;
      return;
    }

    console.log("HTTP server closed.");
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
