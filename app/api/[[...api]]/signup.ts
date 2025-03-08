import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users, account, subscriptions } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { and, sql } from "drizzle-orm";
const app = new Hono();

// Sign-up route (creates user and associated tables during sign-up)

app.get("/", clerkMiddleware(), async (c) => {
  return c.json({ info: "ok at the get route" }, 200);
}
)
 
app.post("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  console.log("Signup started at api");
  const data = await c.req.json(); 
  console.log("Request body data:", data);

  // if (!auth?.userId) {
  //   return c.json({ error: "Unauthorized" }, 401);
  // }


 
  const userEmail = data.email || ""; // User's email
  const userId = auth.userId; // Clerk userId
  console.log("User id from post signup",userId)



  // Check if the user already exists in the `users` table
  const existingUser = await db
  .select()
  .from(users)
  .where(sql`${users.userId} = ${userId}`)  // Use sql helpers for equality
  .limit(1);


  // If the user doesn't exist, create the user and related tables (account and subscription)
  if (existingUser.length === 0) {
    // Create user record in the `users` table
    try{
    const [userData] = await db.insert(users).values({
      userId: userId,
      id: createId(),
      email: userEmail,     
    }).returning();


    // Create a default subscription for the user in the `subscriptions` table
   
    const [subscriptionData] = await db.insert(subscriptions).values({
      userId: userId,
      plan:data.plan,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year subscription for free plan
      status: "active",
      isPaid: false,
      id: createId(),
    }).returning(); 

    // Respond with the created user, account, and subscription
    return c.json({
      user: userData,      
      subscription: subscriptionData,
    });

  } catch(error) {
    console.log("Error at subscription or user creation in db",error);
   }

  } else {
    // If user already exists, return an appropriate message
    return c.json({ message: "User already exists." });
  }
});


// Login route (checks if user exists, and creates associated records if needed)
app.post("/login", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = auth.userId; // Clerk userId
  const user = await c.env.CLERK_API.users.getUser(userId);
  const userEmail = user.email || ""; // User's email
  const userFirstName = user.first_name || ""; // User's first name
  const userLastName = user.last_name || ""; // User's last name

  // Check if the user already exists in the `users` table
  const existingUser = await db
  .select()
  .from(users)
  .where(sql`${users.userId} = ${userId}`)  // Use sql helpers for equality
  .limit(1);

  if (existingUser.length === 0) {
    // User doesn't exist, create the user and related records
    const [userData] = await db.insert(users).values({
      userId: userId,
      email: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
    }).returning();

    // Create a default account for the user
    const [accountData] = await db.insert(account).values({
      userId: userId,
      name: userEmail,
      id: createId(),
    }).returning();

    // Create a default subscription for the user (can default to "free")
    const [subscriptionData] = await db.insert(subscriptions).values({
      userId: userId,
      plan: "free", // Default plan
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // End date for 1 year
      status: "active",
      isPaid: false,
      id: createId(),
    }).returning();

    return c.json({
      user: userData,
      account: accountData,
      subscription: subscriptionData,
    });
  } else {
    // User exists, return a success message
    return c.json({ message: "User logged in successfully." });
  }
});

export default app;
