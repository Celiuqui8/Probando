//deno run --allow-all --watch --import-map=./import_map.json .\src\main.ts
//deno run --allow-all --watch --import-map=./import_map.json Practica2PA/main.ts

import { Application, Router } from "oak";
import { removeSlot } from "./resolvers/delete.ts";
import { allSlots, availableSlots } from "./resolvers/get.ts";
import { addSlot } from "./resolvers/post.ts";
const router = new Router();
router
    //.get("/allSlots",allSlots)
    .post("/addSlot", addSlot)
    .get("/allSlots", allSlots)
    .delete("/removeSlot", removeSlot)
    .get("/availableSlots",availableSlots)
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.info("Server waiting for request on port 1111");
await app.listen({ port: 1111 });
