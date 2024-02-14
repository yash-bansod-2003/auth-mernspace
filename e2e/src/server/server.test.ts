import axios from "axios";

describe("Server (End To End)", () => {
  it("should return 200 status", async () => {
    await axios.get("http://localhost:5001/status").then((res) => {
      expect(res.status).toBe(200);
    });
  });

  it("should return a message", async () => {
    await axios.get("http://localhost:5001/message/yash").then((res) => {
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: "hello yash" });
    });
  });
});
