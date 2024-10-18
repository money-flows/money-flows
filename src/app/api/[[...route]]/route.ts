import { Hono } from "hono";
import { handle } from "hono/vercel";

import { accounts } from "./accounts";
import { categories } from "./categories";
import { chartLayouts } from "./chart-layout";
import { summary } from "./summary";
import { tags } from "./tags";
import { transactions } from "./transactions";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/summary", summary)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/tags", tags)
  .route("/transactions", transactions)
  .route("/chart-layouts", chartLayouts);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
