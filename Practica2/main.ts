//deno run --allow-all --watch --import-map=./import_map.json .\src\main.ts
import { Application, Router } from "oak";
import { deleteUser } from "./resolvers/delete.ts";
import { getUser } from "./resolvers/get.ts";
import { addUser } from "./resolvers/post.ts";
//import { addCar } from "./resolvers/post.ts";
//deno run --allow-all --watch --import-map=./import_map.json .\Pruebas\Practica2\main.ts
///Applications/Universidad/3º/1er semestre/Arquitectura y programación de sistemas en internet/pruebas/Arquitectura_Programacion_Sistemas_Internet
const router = new Router();
router
    .get("/test", (context) => {
        context.response.body = "Working";
    })
    .get("/getUser/:param",getUser)
    .post("/addUser",addUser)
    .delete("/deleteUser/:email",deleteUser)
    //.post("/addCar", addCar)
    //.delete("/removeCar/:id", removeCar)
   // .get("/car/:id", infoCar)
    //.get("/askCar",askCar)
    
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.info("Server waiting for request on port 7777");
await app.listen({ port: 7777 });
