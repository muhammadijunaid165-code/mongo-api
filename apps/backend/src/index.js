import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { registerInterviewSocket } from "./socket.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.WEB_ORIGIN || "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => registerInterviewSocket(io, socket));

async function start() {
  await connectDb();
  server.listen(PORT, () => logger.info(`Backend running on :${PORT}`));
}

start().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});
