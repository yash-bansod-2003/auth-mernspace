import axios from "axios";

describe("Todo (End To End)", () => {
  it("should create new todo", async () => {
    const data = {
      title: "Do Homework",
      description: "I need to survive in class",
      completed: true,
    };

    await axios.post("http://localhost:5001/todos", data).then((res) => {
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("_id");
    });
  });
});
