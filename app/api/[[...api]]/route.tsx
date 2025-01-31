import {handle} from "hono/vercel" ;
import { Hono } from "hono/";
import accounts from "./accounts"
import transactions from "./transactions"
import dashboard from "./dashboard"
import {HTTPException} from "hono/http-exception";


export const runtime="edge";

const app=new Hono().basePath('/api')

const routes= app
.route("/accounts",accounts)
.route("/transactions",transactions)
.route("/dashboard",dashboard);


export const GET= handle(app);
export const POST=handle(app);
export const PATCH=handle(app);
export const DELETE=handle(app);

export type AppType = typeof routes;