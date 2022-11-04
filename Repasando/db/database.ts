import { MongoClient } from "mongo";
import { config } from "dotenv";
import { BookSchema } from "./schemas.ts";
const env = config();
if (env.MONGO_USER || !env.MONGO_PWD) {
    console.error("You need to define MONGO_USER and MONGO_PWD env variable")
}
const client = new MongoClient();
await client.connect(
    `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PWD}@cluster0.oiqo4q4.mongodb.net/bookstore?authMechanism=SCRAM-SHA-1`
);
const db = client.database("bookstore");
console.info("MongoDB connected");
export const BookCollection = db.collection<BookSchema>("Book");