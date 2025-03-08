import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table - stores user-related data (userId as primary key)
export const users = pgTable("users", {
    userId: text("user_id").primaryKey(), // User's unique ID (Clerk user ID)
    email: text("email").notNull(), // User's email
    firstName: text("first_name"),
    lastName: text("last_name"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Account table - stores account-related data, now linking to userId from the users table
export const account = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull().references(() => users.userId), // Link to userId from users table
    plaidId: text("plaid_id"),
    address: text("address").default(''),
    phone: text("phone").default(''),
});

// Transactions table - stores transactions related to an account
export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    userId: text("user_id").notNull().references(() => users.userId), // Link to userId from users table
    name: text("name"),
    type: text("type"),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id").references(() => account.id, { onDelete: "cascade" }), // Link to account
});

// Subscriptions table - stores subscription information, linking to userId from users table
export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.userId), // Link to userId from users table
    plan: text("plan").notNull(), // "free", "premium", "enterprise"
    status: text("status").notNull().default("active"), // Subscription status ("active", "inactive", etc.)
    startDate: timestamp("start_date", { mode: "date" }).notNull(),
    endDate: timestamp("end_date", { mode: "date" }).notNull(), // End date for subscriptions
    isPaid: boolean("is_paid").default(false), // Whether the subscription is paid
});

// Payments table - stores payment details, linking to userId from users table
export const payments = pgTable("payments", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.userId), // Link to userId from users table
    subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id), // Reference to subscription
    amount: integer("amount").notNull(), // Payment amount
    paymentDate: timestamp("payment_date", { mode: "date" }).notNull(), // Payment date
    paymentStatus: text("payment_status").notNull().default("paid"), // Payment status ("paid", "failed", etc.)
    paymentMethod: text("payment_method").notNull(), // Payment method ("credit card", "paypal", etc.)
    transactionId: text("transaction_id").notNull(), // Transaction ID from payment gateway
});

// Relations for Users and Accounts
export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(account), // A user can have many accounts
    subscriptions: many(subscriptions), // A user can have many subscriptions
    payments: many(payments), // A user can have many payments
}));

// Relations for Account and Transactions
export const accountsRelations = relations(account, ({ many }) => ({
    transactions: many(transactions),
}));

// Relations for Subscription and User
export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
    user: one(users, {
        fields: [subscriptions.userId],
        references: [users.userId],
    }),
    payments: many(payments),
}));

// Relations for Payments and User
export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
        fields: [payments.userId],
        references: [users.userId],
    }),
    subscription: one(subscriptions, {
        fields: [payments.subscriptionId],
        references: [subscriptions.id],
    }),
}));

// Schema for inserting User data
export const insertUserSchema = createInsertSchema(users);

// Schema for inserting Account data
export const insertAccountSchema = createInsertSchema(account);

// Schema for inserting Transaction data
export const insertTransactionsSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
});

// Schema for inserting Subscription data
export const insertSubscriptionSchema = createInsertSchema(subscriptions);

// Schema for inserting Payment data
export const insertPaymentSchema = createInsertSchema(payments);
