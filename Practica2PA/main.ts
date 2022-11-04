//deno run --allow-all --watch --import-map=./import_map.json .\src\main.ts
//deno run --allow-all --watch --import-map=./import_map.json Practica2PA/main.ts

import { Application, Router } from "oak";
import { removeCar } from "./resolvers/delete.ts";
import { allCars, askCar, getCarId } from "./resolvers/get.ts";
import { addCar } from "./resolvers/post.ts";
import { releaseCar } from "./resolvers/put.ts";

const router = new Router();
router
    .get("/test", (context) => {
        context.response.body = "Working";
    })
    .post("/addCar", addCar)
    .delete("/removeCar/:id", removeCar)
    .get("/car/:id",getCarId)
    .get("/allCars", allCars)
    .put("/releaseCar/:id",releaseCar)
    .get("/askCar",askCar)    
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.info("Server waiting for request on port 8888");
await app.listen({ port: 8888 });
