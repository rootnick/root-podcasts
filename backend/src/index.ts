import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {
  getAllCountries,
  getAllTopics,
  getFavoritePodcasts,
  getPodcasts,
  getPodcastsByName,
} from "./database";

const app = new Hono();

app.get("/countries", (c) => {
  return c.json(getAllCountries());
});

app.get("/topics", (c) => {
  return c.json(getAllTopics());
});

app.get("/podcasts/favorite", (c) => {
  return c.json(getFavoritePodcasts());
});

app.get("/podcasts/search", (c) => {
  const { s } = c.req.query();
  return c.json(getPodcastsByName(s));
});

app.get("/podcasts", (c) => {
  const { country, topic } = c.req.query();
  return c.json(getPodcasts(country, topic));
});

const port = 4000;

console.log("Server is running on port", port);

serve({
  fetch: app.fetch,
  port,
});
