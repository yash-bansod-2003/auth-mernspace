import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello Yash Bansod");
});
app.use(errorHandler);

export default app;
