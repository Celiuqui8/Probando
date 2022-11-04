import {Slots} from "../types.ts";
import { ObjectId } from "mongo";
export type SlotsSchema = Slots & { _id: ObjectId };
