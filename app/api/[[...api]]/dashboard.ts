import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { transactions, account } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { and, count, eq, sql, isNotNull, gte, lte } from "drizzle-orm";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get query params (optional)
      const startDate = c.req.query("startDate") || null;
      const endDate = c.req.query("endDate") || null;

      // Build the filter condition for transactions date range
      let dateFilter = sql`1=1`; // Default to always true
      if (startDate && endDate) {
        dateFilter = and(
          gte(transactions.date, sql`${startDate}`),
          lte(transactions.date, sql`${endDate}`)
        );
      }

      // Total Amount
      const totalAmount = await db
        .select({
          amount: sql<number>`SUM(${transactions.amount})`,
        })
        .from(transactions)
        .innerJoin(account, eq(transactions.accountId, account.id))
        .where(and(dateFilter, eq(account.userId, auth.userId)))
        .execute();

      // Total Accounts
      const totalAccounts = await db
        .select({
          noOfAccounts: count(account.id),
        })
        .from(account)
        .where(eq(account.userId, auth.userId))
        .execute();

      // Top Accounts
      const topAccounts = await db
        .select({
          id: account.id,
          name: account.name,
          totalAmount: sql<number>`SUM(${transactions.amount})`,
        })
        .from(account)
        .leftJoin(transactions, eq(account.id, transactions.accountId))
        .where(and(dateFilter, eq(account.userId, auth.userId)))
        .groupBy(account.id)
        .having(isNotNull(sql`SUM(${transactions.amount})`))
        .orderBy(sql<number>`SUM(${transactions.amount}) DESC`)
        .limit(10);

      return c.json({ totalAmount, totalAccounts, topAccounts });
    }
  );

export default app;
