import { Book} from "../types.ts";
import { ObjectId } from "mongo";
export type BookSchema = Book & { _id: ObjectId };
//import map para importar archivos