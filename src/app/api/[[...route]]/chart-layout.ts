import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { chartLayout } from "@/db/schema";

import { insertChartLayoutSchema } from "./schema";

export const chartLayouts = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(chartLayout)
      .where(eq(chartLayout.userId, auth.userId));

    return c.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertChartLayoutSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(chartLayout)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      if (!data) {
        return c.json({ error: "Failed to create chart layout" }, 500);
      }

      return c.json({ data });
    },
  )
  .put(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertChartLayoutSchema),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing chart layout ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(chartLayout)
        .set(values)
        .where(and(eq(chartLayout.userId, auth.userId), eq(chartLayout.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Failed to update chart layout" }, 500);
      }

      return c.json({ data });
    },
  );
