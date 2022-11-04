import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { SlotCollection } from "../db/database.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { Slots } from "../types.ts";

type AllSlotsContext=RouterContext<"/allSlots",
    Record<string | number, string | undefined>, Record<string, any>>;

type AvailableSlotsContext=RouterContext<"/availableSlots",
    Record<string | number, string | undefined>, Record<string, any>>;

export const availableSlots = async (context: AvailableSlotsContext)=>{
    try {
        const params = getQuery(context, { mergeParams: true });//Para coger los parámetros 
        if (params.day && params.month && params.year) {
            const date = {
                day: params.day,
                month: params.month,
                year: params.year,
            }       
            const slot = await SlotCollection.findOne({ date });
            if (slot) {
                const myslot = await SlotCollection.find(slot).toArray();
                context.response.body = myslot;
            }
            else {
                context.response.body = {   };

            }
            
        }else if (params.month && params.year) {
            const date = {
                month: params.month,
                year: params.year,
            }       
            console.log(date);
            const slot = await SlotCollection.findOne({ date });
            if (slot) {
                const myslot = await SlotCollection.find(slot).toArray();
                context.response.body = myslot;
            }
            else {
                context.response.body = {   };
            }
            
        }
        else {
            context.response.body = { Message: "Not the right format" };
            context.response.status = 406;
        }
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}

export const allSlots = async (context: AllSlotsContext) => {
    try {
        const slot = await SlotCollection.find({}).toArray();
        const myslots = slot.map((littleslot) => ({
            id: littleslot._id.toString(),
            day: littleslot.day,
            month: littleslot.month,
            year: littleslot.year,
            hour: littleslot.hour,
            available:littleslot.available,
  }));
        context.response.body = myslots;
    } catch (error) {
        console.error(error);
        context.response.body = 500;
    }
}