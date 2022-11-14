import { connect } from "./mongo.js";
import express from "express";
import http from "http";
import cron from "node-cron";
import { config } from "dotenv";
config();
import { env } from "process";
import { exoworlds } from "./scraper.js";

const app = express();

export const server = http.createServer(app);

const { PORT, CRON } = env;

export default server.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  const DB = await connect();
  cron.schedule(CRON.toString(), () => exoworlds(DB));
});
