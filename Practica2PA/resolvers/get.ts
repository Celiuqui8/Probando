import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { RouterContext } from "oak/router.ts";
import { CarCollection } from "../db/database.ts";
import { CarSchema } from "../db/schemas.ts";
import { Car } from "../type.ts";

type AskCarContext = RouterContext<"/askCar",
    Record<string | number, string | undefined>, Record<string, any>>;
type CarContext = RouterContext<"/car/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>;
type AllCarsContext=RouterContext<"/allCars",
    Record<string | number, string | undefined>, Record<string, any>>;

export const getCarId = async (context: CarContext) => {
    try {
        if (context.params?.id) {
        const car: CarSchema | undefined = await CarCollection.findOne({_id: new ObjectId(context.params.id),
        });
            if (car) {
                context.response.body = {
                    id: car._id,
                    plate: car.plate,
                    seats: car.seats,
                    free: car.free,
            }; return; 
            }
        }
        context.response.status = 404;
        
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}
export const allCars = async (context: AllCarsContext) => {
    try {
        const cars = await CarCollection.find({}).toArray();
        const mycars = cars.map((littlecar) => ({
            id: littlecar._id.toString(),
            plate: littlecar.plate,
            seats: littlecar.seats,
            free: littlecar.free,
  }));
        context.response.body = mycars;
    } catch (error) {
        console.error(error);
        context.response.body = 500;
    }
}

export const askCar = async (context: AskCarContext) => {
    try {
        const freecars = await CarCollection.find({ free: true }).toArray();
        if (freecars.length > 0) {
            const car = freecars[0];
            /*const mytinnycar: Partial<Car> = {
                plate: car.plate,
                seats: car.seats,
                free: false,
            }
            const id = await CarCollection.insertOne(mytinnycar as CarSchema);
            car.id = id.toString();
            context.response.body = {
                id: mytinnycar.id,
                plate: mytinnycar.plate,
                seats: mytinnycar.seats,
                free:mytinnycar.free,
            }*/
            const { _id, ...carWithoutId } = car as CarSchema;
            await CarCollection.updateOne(
                        { _id},//dado el id
                        {
                            $set: { free: false, },//cambiamos el estado a free
                });
            context.response.body = {
                ...carWithoutId,
                id: _id.toString(),
            };

        } else {
            context.response.status = 404;
            context.response.body = {
                Message: "There is no free cars available"
            };
        }
        
    } catch (error) {
        console.error(error);
        context.response.status = 500;
    }
}