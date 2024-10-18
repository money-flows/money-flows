import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { tag } from "@/db/schema";

export const tags = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      types: z
        .string()
        .optional()
        .transform((value) => value?.split(","))
        .pipe(z.array(z.enum(["income", "expense"])).optional()),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { types } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: tag.id,
        name: tag.name,
        type: tag.type,
        userId: tag.userId,
      })
      .from(tag)
      .where(
        and(
          eq(tag.userId, auth.userId),
          types ? inArray(tag.type, types) : undefined,
        ),
      );

    return c.json({ data });
  },
);
