import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import app from "./server.js";

dotenvExpand.expand(dotenv.config());

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`🚀 Pix Proxy rodando em http://localhost:${port}`);
});

const shutdown = () => {
  console.log("\nEncerrando Pix Proxy...");
  server.close(() => {
    console.log("Pix Proxy encerrado com segurança");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
