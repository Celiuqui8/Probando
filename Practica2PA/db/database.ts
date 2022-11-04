import { MongoClient } from "mongo";
import { config } from "dotenv";
import { CarSchema } from "./schemas.ts";
const env = config();
if (!env.MONGO_USER || !env.MONGO_PWD) {
    console.error("You need to define MONGO_USER and MONGO_PWD env variable")
}
const client = new MongoClient();
await client.connect(
    `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PWD}@cluster0.oiqo4q4.mongodb.net/myCabify?authMechanism=SCRAM-SHA-1`
);
const db = client.database("myCabify");
console.info("MongoDB connected");
export const CarCollection = db.collection<CarSchema>("Car");
