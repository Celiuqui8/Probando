//deno run --allow-all --watch --import-map=./import_map.json .\src\main.ts
import { Application, Router } from "oak";
import { deleteBook } from "./resolvers/delete.ts";
import { getBook, getBooks } from "./resolvers/get.ts";
import { postBooks } from "./resolvers/post.ts";
import { putBook } from "./resolvers/put.ts";
const router = new Router();

router
   .get("/test", (context) => {
        context.response.body = "Working";
    })
  .get("/books", getBooks)
  .get("/books/:id", getBook)
  .post("/books", postBooks)
  .delete("/books/:id", deleteBook)
  .put("/books/:id", putBook);
    
   
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.info("Server waiting for request on port 8888");
await app.listen({ port: 8888 });
