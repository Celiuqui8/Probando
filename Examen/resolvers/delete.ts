import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { SlotCollection } from "../db/database.ts";
type RemoveSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


/*export const removeSlot =  async(context: RemoveSlotContext) => {
    try {
        const params = getQuery(context, { mergeParams: true });//Para coger los parámetros 
        if (params.day && params.month && params.year && params.hour) {
            const slot = await SlotCollection.find().toArray();
            if (slot.length > 0) {
                await SlotCollection.deleteOne({ available: true });
                context.response.body = { message: "Slot kaput" };
                context.response.status = 200;
            }
            else {
                context.response.body = { message: "Sorry you have to work that day" };
                context.response.status = 409;
            }
        }
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}*/
export const removeSlot = async (context: RemoveSlotContext) => {
     try {
        const params = getQuery(context, { mergeParams: true });//Para coger los parámetros 
        if (params.day && params.month && params.year&&params.hour) {
            const date = {
                day: params.day,
                month: params.month,
                year: params.year,
                hour:params.hour,
            }       
            const myslot = await SlotCollection.find({ date }).toArray();
            const freeslots = await SlotCollection.findOne({ available: true });
                if (freeslots) {
                    await SlotCollection.deleteOne(freeslots);
                    context.response.body = { message: "Slot kaput" };
                    context.response.status = 200;
                }
                else {
                    context.response.body = { message: "Sorry you have to work that day" };
                    context.response.status = 409;
                }
                
        }
        else {
                context.response.body = {  message: "Not the right format"  };

        }
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}