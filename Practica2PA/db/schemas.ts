import {Car} from "../type.ts";
import { ObjectId } from "mongo";
export type CarSchema = Car & { _id: ObjectId };
