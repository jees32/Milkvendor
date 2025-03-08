import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {transactions, insertAccountSchema,insertTransactionsSchema,account} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import {HTTPException} from "hono/http-exception";
import {createId} from "@paralleldrive/cuid2"
import {z} from 'zod';
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

const app= new Hono()
.get("/", 
    clerkMiddleware(),
    async(c) => {
        const auth=getAuth(c);

        if (!auth?.userId){
            return c.json({error:"unauthorised"},401)
        }        
    const data= await db    
    .select ({    
        name:transactions.name,
       id:transactions.id,
       amount:transactions.amount,
       type:transactions.type,
       notes:transactions.notes,
       date:transactions.date       
    })
    .from (transactions)
    .innerJoin(account, eq(transactions.accountId, account.id))   
    .where(eq(auth.userId,transactions.userId))
    .execute();
    
    return c.json({ data});
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

        const data= await db    
        .select ({
        
           name:transactions.name,
           id:transactions.id,
           amount:transactions.amount,
           type:transactions.type,
           notes:transactions.notes,
           date:transactions.date       
        })
        . from (transactions)
        .innerJoin(account, eq(transactions.accountId, account.id))
        .where(eq(transactions.accountId,id))   
        .execute();
        if (!data) {
            return c.json({error: "Not found"}, 404 )
        }
        
        return c.json({data});

    }

)
.get("tid/:tid",
    zValidator("param",z.object({
        tid:z.string().optional(),

    })),
    clerkMiddleware(),
    async (c) => {
        const auth=getAuth(c);
        const {tid}= c.req.valid("param");
        console.log("Tid id",tid)

        if(!tid ) {
            return c.json({error:"Missing id"},400);
        }
        if(!auth?.userId ) {
            return c.json({error:"Unauthorized"},401);
        }

        const data= await db    
        .select ({
        
           name:transactions.name,
           id:transactions.id,
           amount:transactions.amount,
           type:transactions.type,
           notes:transactions.notes,
           date:transactions.date       
        })
        . from (transactions)       
        .where(eq(transactions.id,tid))   
        .execute();
        if (data.length === 0) {  // ✅ Correct check for empty array
            return c.json({ error: "Not found" }, 404);
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
        const name = body.name; 
        const [{id:accountId}]=await db .select ({      
            id:account.id                  
        })
         .from (account)    
         .where(eq(account.name, name))
         .execute();

        const validation = insertTransactionsSchema.pick({ 
            amount:true,
            name:true,
            date:true,
            type:true,
            notes:true,
        })
       .safeParse(body);
       
        try{
            if (!validation.success) {
                return c.json(
                  { error: "Invalid input", details: validation.error.errors },
                  400
                );
              }
              let values = validation.data;

              if (values.type === "Payment") {
                values = { ...values, amount: -Math.abs(values.amount) }; // Ensure negative value
            }

              const [data]=await db.insert(transactions).values({
                userId:auth.userId,
                accountId:accountId,
                ...values,
                id:createId(),
            }).returning();
            return c.json({data});        
        
    }catch (error) {
        console.error("Error in POST /:", error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
   
    })

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
            .delete(transactions)
            .where(
            and(
                eq(transactions.userId,auth.userId),
                inArray(transactions.id,values.ids)
            )
        ).returning({
            id:transactions.id,
        });

        return c.json({data});

        }



     )
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
            .delete(transactions)            
            .where(
                and(
                    eq(transactions.userId,auth.userId),
                    eq(transactions.id,id),

                )
            )
            .returning();             
            

            if(!data){
                return c.json({ error:"Not found"},404);
            }
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
            insertTransactionsSchema.pick({
                name:true,
                date: true,
                type: true,
                amount: true,
                notes:true

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
            .update(transactions)
            .set(values)
            .where(
                and(
                    eq(transactions.userId,auth.userId),
                    eq(transactions.id,id),

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