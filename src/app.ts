import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello Yash Bansod");
});

export default app;
