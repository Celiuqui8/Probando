import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { RouterContext } from "oak/router.ts";
import { CarCollection } from "../db/database.ts";
type RemoveCarContext = RouterContext<"/removeCar/:id",{
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>
export const removeCar = async (context: RemoveCarContext) => {
    try {
        if (context.params?.id) {
            const car = await CarCollection.findOne({
                _id: new ObjectId(context.params.id),
            });
            if (car) {
                if (car.free) {
                    await CarCollection.deleteOne({
                        _id: new ObjectId(context.params.id),
                    });
                    context.response.status = 200;
                    context.response.body = { message: "The car has been removed succesfully" };

                } else {
                    context.response.status = 400;
                    context.response.body = { message: "Car is not free" };
                }
            } else {
                context.response.status = 404;
                context.response.body = { message: "Car not found" };
            }
        }
    } catch (e) {
        console.error(e);
        context.response.status = 500;
    }
};