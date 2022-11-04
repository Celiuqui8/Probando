import { RouterContext } from "oak/router.ts";
import { CarCollection } from "../db/database.ts";
import { CarSchema } from "../db/schemas.ts";
import { Car } from "../type.ts";

type AddCarContext = RouterContext<"/addCar",
    Record<string | number, string | undefined>,
    Record<string, any>
    >;
export const addCar = async (context: AddCarContext)=>{
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value.seats || !value.plate) {
            context.response.body = "You need to specify number of seats and a plate";
            context.response.status = 404;
        }
        const found = await CarCollection.findOne({ plate: value.plate })
        if (found) {
            context.response.body = "There is already a car with this same plate";
            context.response.status = 400;
        }
        else {
            const car: Partial<Car> = {
                plate: value.plate,
                seats: value.seats,
                free: true,
            }
            const id = await CarCollection.insertOne(car as CarSchema);
            car.id = id.toString();
            context.response.body = {
                id: car.id,
                plate: car.plate,
                seats: car.seats,
                free:car.free,
            }
        }   
    } catch (e) {
         console.error(e);
        context.response.status = 500;
    }
}