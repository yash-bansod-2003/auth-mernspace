import mongoose from "mongoose";

async function connectToDatabase(dbUrl: string) {
  try {
    await mongoose.connect(dbUrl);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export { connectToDatabase };
