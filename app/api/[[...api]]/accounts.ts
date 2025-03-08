import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {account, insertAccountSchema,transactions} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import {HTTPException} from "hono/http-exception";
import {createId} from "@paralleldrive/cuid2"
import {z} from 'zod';
import { and, eq, inArray,sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

const app= new Hono()
.get("/", 
    clerkMiddleware(),
    async(c) => {
        const auth=getAuth(c);

        if (!auth?.userId){
            return c.json({error:"unauthorised"},401)
        }   

    try{  
        const data = await db
        .select({
          id: account.id,
          name: account.name,
          totalAmount: sql<number>`SUM(${transactions.amount})`,
          phone: account.phone,
          address:account.address,
        })
        .from(account)
        .leftJoin(transactions, eq(account.id, transactions.accountId))  
        .groupBy(account.id)
        .where(eq(auth.userId,account.userId));      
       
        console.log("Raw Data:", data);

      if (data.length === 0) {
        return c.json({ error: "No data found" }, 404);
      }

      // Map results to a plain object
     

      return c.json({ data});
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return c.json({ error: error.message }, 500);
    }

})
.get(":id",
    zValidator("param",z.object({
        id:z.string().optional(),

    })),
    clerkMiddleware(),
    async (c) => {
        const auth=getAuth(c);
        const {id}= c.req.valid("param");

        if(!id ) {
            return c.json({error:"Missing id"},400);
        }
        if(!auth?.userId ) {
            return c.json({error:"Unauthorized"},401);
        }

        const [data]= await db.select({
            id:account.id,
            name:account.name,
            phone:account.phone,
            address:account.address,
        })
        .from(account)
        .where(
            and(
                eq(account.userId,auth.userId),
                eq(account.id,id)
            )

        );
        if (!data) {
            return c.json({error: "Not found"}, 404 )
        }
        
        return c.json({data});

    }

)
.post(
    "/",
    clerkMiddleware(),    
     async (c) => {
        const auth=getAuth(c);
       
        if (!auth?.userId){
            return c.json({error:"UnauthoriZed"},401)
        }
        const body = await c.req.json();
        const validation = insertAccountSchema.pick({ 
            name: true,
            address:true,
            phone:true,

         }).safeParse(body);

        if (!validation.success) {
            return c.json(
              { error: "Invalid input", details: validation.error.errors },
              400
            );
          }

          const values = validation.data;

        try {
        const [data]=await db.insert(account).values({
            userId:auth.userId,
            ...values,
            id:createId(),
        }).returning();
        return c.json({data});
    } catch (error) {
        console.error("Error inserting account:", error);
        return c.json({ error: "Failed to create account" }, 500);
    }
     })
     
     .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id:z.string().optional(),
            })
        ),
      
        async (c) =>{
            const auth=getAuth(c);
            const {id}=c.req.valid("param");
            

            if (!id ) {
                return c.json({error:"Missing id"},400);
            }

            if (!auth?.userId ) {
                return c.json({error:"Unauthorized"},401);
            }

            const [data]= await db
            .delete(account)            
            .where(
                and(
                    eq(account.userId,auth.userId),
                    eq(account.id,id),

                )
            )
            .returning();             
            

            if(!data){
                return c.json({ error:"Not found"},404);
            }
            return c.json({data});

        }

     )

     .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids:z.array(z.string()),

            }),
        ),
        async (c) =>{
            const auth=getAuth(c);
            const values=c.req.valid("json");

            if (!auth?.userId){
                return c.json({error:"Unauthorized"},401);
            }

            const data = await db
            .delete(account)
            .where(
            and(
                eq(account.userId,auth.userId),
                inArray(account.id,values.ids)
            )
        ).returning({
            id:account.id,
        });

        return c.json({data});

        }



     )
     .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id:z.string().optional(),
            })
        ),
        zValidator(
            "json",
            insertAccountSchema.pick({
                name:true,
                phone:true,
                address:true,

            })
          
        ),
        async (c) =>{
            const auth=getAuth(c);
            const {id}=c.req.valid("param");
            const values=c.req.valid("json");

            if (!id ) {
                return c.json({error:"Missing id"},400);
            }

            if (!auth?.userId ) {
                return c.json({error:"Unauthorized"},401);
            }

            const [data]= await db
            .update(account)
            .set(values)
            .where(
                and(
                    eq(account.userId,auth.userId),
                    eq(account.id,id),

                )
            )
            .returning();

            if(!data){
                return c.json({ error:"Not found"},404);
            }
            return c.json({data});

        }

     )

export default app;