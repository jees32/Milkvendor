import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {transactions, insertAccountSchema,insertTransactionsSchema,account} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import {HTTPException} from "hono/http-exception";
import {createId} from "@paralleldrive/cuid2"
import {z} from 'zod';
import { and, count, eq, inArray,isNotNull,sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";


const app= new Hono()
.get("/", 
    clerkMiddleware(),
    async(c) => {
        const auth=getAuth(c);

        if (!auth?.userId){
            return c.json({error:"unauthorised"},401)
        }        
    const totalAmount= await db   
    .select ({   
    amount:sql<number>`SUM(${transactions.amount})`
    })
    . from (transactions)
    .innerJoin(account, eq(transactions.accountId, account.id))   
    .execute();


    const totalAccounts= await db    
    .select ({    
      noOfAccounts:  count(account.id) 
     
    })
    . from (account)     
    .execute();

    const topAccounts= await db    
    .select({
        id: account.id,
        name: account.name,
        totalAmount: sql<number>`SUM(${transactions.amount})`,
        
        
      })
      .from(account)
      .leftJoin(transactions, eq(account.id, transactions.accountId))  
      .groupBy(account.id)
      .having(isNotNull(sql`SUM(${transactions.amount})`))
      .orderBy(sql<number>`SUM(${transactions.amount}) DESC`)
      .limit(10); 
    
    return c.json({ totalAmount,totalAccounts,topAccounts});
})


export default app;