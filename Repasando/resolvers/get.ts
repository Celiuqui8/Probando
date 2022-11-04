import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BookCollection } from "../db/database.ts";
import { BookSchema } from "../db/schemas.ts";
type GetBooksContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetBookContext = RouterContext<
  "/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
    >;
type GetBookByAuthorContext = RouterContext<
  "/books/:author",
  {
    author: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
    >;
    

export const getBooks = async (context: GetBooksContext) => {
  const params = getQuery(context, { mergeParams: true });
  if (params?.sort === "desc") {
    const books = await BookCollection.find({}).sort({ title: -1 }).toArray();
    context.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      auhtor: book.author,
    }));
    return;
  } else if (params?.sort === "asc") {
    const books = await BookCollection.find({}).sort({ title: 1 }).toArray();
    context.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      auhtor: book.author,
    }));
  }

  const books = await BookCollection.find({}).toArray();
  context.response.body = books.map((book) => ({
    id: book._id.toString(),
    title: book.title,
    auhtor: book.author,
  }));
};

export const getBook = async (context: GetBookContext) => {
  if (context.params?.id) {
    const book: BookSchema | undefined = await BookCollection.findOne({
      _id: new ObjectId(context.params.id),
    });

    if (book) {
      context.response.body = book;
      return;
    }
  }

  context.response.status = 404;
};
/*export const getBookByAuthor = async (context: GetBookByAuthorContext) => {
    try {
        const check=context.params?.author
        if (check) {
            const book= await BookCollection.find({}).toArray();

            if (book) {
            context.response.body = book;
            return;
            } else {
                context.response.body = {
                    message: "todo mal"
                };
                return;
            }
        }

        context.response.status = 404;
    } catch (e) {
        context.response.status = 500;
        
    }
}*/