const greet = (): string => {
    const user = {
        name: "Yash Gajanan Bansod",
        age: 20
    }
    return `Hello ${user["name"]}`
};

greet();
