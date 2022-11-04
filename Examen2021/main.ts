//deno run --allow-all --watch --import-map=./import_map.json .\src\main.ts
import { Application, Router } from "oak";
import { getFreeSeats, getStatus } from "./resolvers/get.ts";
const router = new Router();
router
    .get("/tryme", (context) => {
        context.response.body = "Working";
    })
    .get("/getStatus", getStatus)
    .get("/freeseats",getFreeSeats)
    
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.info("Server waiting for request on port 7777");
await app.listen({ port: 7777 });
