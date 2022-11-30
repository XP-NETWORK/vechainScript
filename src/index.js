import { connect } from "./mongo.js";
import express from "express";
import http from "http";
import cron from "node-cron";
import { config } from "dotenv";
config();
import { env } from "process";
import { exoworldsIpfs, fantase, exoworldImages } from "./scraper.js";

const app = express();

export const server = http.createServer(app);

const { PORT, CRON } = env;

export default server.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  const DB = await connect();
  cron.schedule(CRON.toString(), () => exoworldsIpfs(DB));
  cron.schedule(CRON.toString(), () => fantase(DB));
  cron.schedule(CRON.toString(), () => exoworldImages(DB));
});
