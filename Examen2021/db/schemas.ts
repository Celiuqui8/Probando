import { Reserva} from "../types.ts";
import { ObjectId } from "mongo";
export type ReservaSchema = Reserva & { _id: ObjectId };

