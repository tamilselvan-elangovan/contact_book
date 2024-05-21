import express, { Express, Request, Response } from "express";
import { authorization } from "./src/shared/authorization";
import { connect } from "./src/database/connection";

const app: Express = express();



app.use(express.json())

app.use('/auth', require('./src/modules/authorization/authorization_router.ts'))
app.use('/contacts', authorization, require('./src/modules/contacts/contacts_router.ts'))


app.listen(8080, async () => {
  console.info(`[server]: Server is running at http://localhost:${8080}`);
  connect()
});