import { pgTable,text,integer, timestamp } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const account=pgTable("accounts",{
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    plaidId: text("plaid_id"),
    address:text("address").default(''),
    phone:text("phone").default(''),
});

export const transactions=pgTable("transactions",{
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    userId: text("user_id").notNull(),
    name: text("name"),
    type: text("type"),
    notes:text("notes"),
    date:timestamp("date",{mode:"date"}).notNull(),
    accountId:text("account_id").references(() => account.id,
{onDelete:"cascade"}),
});

export const accountsRelations = relations(account,({ many}) => ({
    transactions:many(transactions),
}));

export const transactionsRelations = relations(transactions,({one}) => ({
    account:one(account,{
        fields: [transactions.accountId],
        references: [account.id],
    }),
}));
export const insertAccountSchema=createInsertSchema(account)
export const insertTransactionsSchema = createInsertSchema(transactions,
    {
        date:z.coerce.date(),
    }
)