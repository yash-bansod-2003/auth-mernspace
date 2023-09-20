import { describe, expect, test } from "@jest/globals";
import request from "supertest";

import { sum, calculateDiscount } from "./src/app";
import app from "./src/app";

describe("App", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    }),
        test("discount on 100 of 10% to equal 90", () => {
            expect(calculateDiscount(100, 10)).toBe(10);
        }),
        test("should return 200 status", async () => {
            const response = await request(app).get("/").send();
            expect(response.statusCode).toBe(200);
        });
});
