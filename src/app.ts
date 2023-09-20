import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

export const sum = (a: number, b: number): number => {
    return a + b;
};

export const calculateDiscount = (
    price: number,
    percentage: number,
): number => {
    return (price * percentage) / 100;
};

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello Yash Bansod");
});
app.use(errorHandler);

export default app;
