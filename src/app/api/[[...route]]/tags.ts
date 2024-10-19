import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { tag } from "@/db/schema";

import { insertTagSchema } from "./schema";

export const tags = new Hono()
  .get(
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
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing tag ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: tag.id,
          name: tag.name,
          type: tag.type,
          userId: tag.userId,
        })
        .from(tag)
        .where(and(eq(tag.userId, auth.userId), eq(tag.id, id)));

      if (!data) {
        return c.json({ error: "Tag not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTagSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(tag)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTagSchema),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing tag ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(tag)
        .set(values)
        .where(and(eq(tag.userId, auth.userId), eq(tag.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Tag not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing tag ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .delete(tag)
        .where(and(eq(tag.userId, auth.userId), eq(tag.id, id)))
        .returning({
          id: tag.id,
        });

      if (!data) {
        return c.json({ error: "Tag not found" }, 404);
      }

      return c.json({ data });
    },
  );
