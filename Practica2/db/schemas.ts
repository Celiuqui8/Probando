import { Transactions, User } from "../types.ts";
import { ObjectId } from "mongo";
export type UserSchema = User & { _id: ObjectId };
export type TransactionSchema = Transactions & { _id: ObjectId };

//import map para importar archivos