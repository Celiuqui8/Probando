import { RouterContext } from "oak/router.ts";
import { SlotCollection } from "../db/database.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { Slots } from "../types.ts";

type AddSlotContext = RouterContext<"/addSlot",
    Record<string | number, string | undefined>,
    Record<string, any>
    >;
export const addSlot = async (context: AddSlotContext)=>{
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value.day || !value.month || !value.year || !value.hour) {
            context.response.body = { message: "You need to specify day, month, year and hour" };
            context.response.status = 404;
        }
        //value.day>28&&value.month===2
        else if (value.day < 1 || value.day > 31 || value.month < 1 || value.month > 12 || value.year < 2022 || value.hour < 0 || value.hour > 23||(value.day>28&&value.month)) {
            context.response.body ={message:"You need to specify a valid date"} ;
            context.response.status = 406;
        } else {
            const found = await SlotCollection.findOne({ day: value.day, month: value.month, year: value.year, hour: value.hour })
            if (found) {
                if (!found.available) {
                    context.response.body = { message: "There is already a slot with this same date and hour" };
                    context.response.status = 409;
                    await SlotCollection.updateOne({ day: value.day, month: value.month, year: value.year, hour: value.hour }, { $set: { available: false } });
                }
                else {
                    context.response.body = { message: "You already had this exact date " };
                    context.response.status = 200;
                }
            }
            else {
                const slot: Partial<Slots> = {
                    day: value.day,
                    month: value.month,
                    year: value.year,
                    hour: value.hour,
                    available: true,
                }
                const dni = await SlotCollection.insertOne(slot as SlotsSchema);
                slot.dni = dni.toString();
                context.response.body = {
                    dni: slot.dni,
                    day: slot.day,
                    month: slot.month,
                    year: slot.year,
                    hour: slot.hour,
                    available: slot.available,
                }
            }
        }
    } catch (error) {
         console.error(error);
        context.response.status = 500;
    }
}