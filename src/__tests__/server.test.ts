import supertest from "supertest";
import { createServer } from "../server";

describe("server", () => {
  it("health check should returns 200", async () => {
    await supertest(createServer())
      .get("/status")
      .expect(200)
      .then((res) => {
        expect(res.ok).toBe(true);
      });
  });

  it("message endpoint should says hello", async () => {
    await supertest(createServer())
      .get("/message/john")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ message: "hello john" });
      });
  });
});
