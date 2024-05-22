import express, { Express, Request, Response } from "express";
import { authorization } from "./src/shared/authorization";
import { connect } from "./src/database/connection";

const app: Express = express();
const port: number = 8000


app.use(express.json())

app.use('/auth', require('./src/modules/authorization/authorization_router'))
app.use('/contacts', authorization, require('./src/modules/contacts/contacts_router'))


app.listen(port, async () => {
  console.info(`[server]: Server is running at http://localhost:${port}`);
  connect()
});