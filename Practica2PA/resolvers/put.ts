import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { RouterContext } from "oak/router.ts";
import { CarCollection } from "../db/database.ts";
import { CarSchema } from "../db/schemas.ts";
type ReleaseCarContext = RouterContext<"/releaseCar/:id",{
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>
export const releaseCar = async (context: ReleaseCarContext) => {
    try {
        if (context.params?.id) {
            const car = await CarCollection.findOne({
                _id: new ObjectId(context.params.id),
            });
            if (car) {
                if (car.free) {
                    context.response.status = 400;
                    context.response.body = { message: "The car is already free" };

                } else {
                    await CarCollection.updateOne(
                        { _id: car._id, },//dado el id
                        {
                            $set: { free: true, },//cambiamos el estado a free
                        });
                    context.response.status = 200;
                    context.response.body = { message: "Now the car iS free" };
                }
            } else {
                context.response.status = 404;
                context.response.body = { message: "Car not found" };
            }
        }
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}
