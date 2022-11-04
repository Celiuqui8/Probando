import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { DBRef } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/database.ts";
type GetUserContext = RouterContext<"/getUser/:param", {
    param: string;
} & Record<string | number, string | undefined>, Record<string, any>
    >;
type GetAllUsers = RouterContext<
  "/allUsers",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const getUser = async (context: GetUserContext) => {
    try {
        if (!context.params.param) {
            context.response.body = {
                message: "No existen los parametros"
            };
        } else {
            //Faltaría comprobar los parámetros
            let arg = {}
            if (new RegExp("^[0-9]{8,8}[A-Za-z]$").test(context.params?.param)) {
                arg = { DNI: context.params?.param }
            } else if (new RegExp("[0-9]{9}").test(context.params?.param)) {
                arg = { Telefono: context.params?.param }
            } else if (new RegExp("^[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(context.params?.param)) {
                arg = { Email: context.params?.param }
                //} else if (new RegExp("([a-zA-Z]{2})\s\t(\d{2})\s\t(\d{4})\s\t(\d{4})\s\t(\d{2})\s\t(\d{10})").test(context.params?.param)) {
                // arg = { IBAN: context.params?.param }
            } else {
                arg = { _id: context.params?.param }
            }
        
            const user = await UserCollection.find(arg).toArray();
            const myuser = user.map((user) => {
                return {
                    _id: user._id.toString(),
                    Nombre: user.Nombre,
                    Apellidos: user.Apellidos,
                    DNI: user.DNI,
                    Telefono: user.Telefono,
                    Email: user.Email,
                    IBAN:user.IBAN,

                };
            });
            if (!user) {
                context.response.status = 400;
                context.response.body = {
                    message: "User is not in DB",
                };
                return;
            } else {
                context.response.body = myuser;
            }
        }
    } catch (e) {
        console.log("Error en el programa");
    }
} 
/*
export const allUsers = async (context: GetAllUsers) => {
    try {
        const userss = await UserCollection.find({}).toArray();
        context.response.body = userss.map((user) => {
            return {
                _id: user._id.toString(),
                Nombre: user.Nombre,
                Apellidos: user.Apellidos,
                DNI: user.DNI,
                Telefono: user.Telefono,
                Email: user.Email,
            };
        });
    } catch (e) {
        console.error(e);
        console.log("Error en el programa");
    }
}
*/