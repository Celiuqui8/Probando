import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/database.ts";
type GetUserContext = RouterContext<"/getUser/:param", {
    param: string;
} & Record<string | number, string | undefined>, Record<string, any>
>;
export const getUser = async (context: GetUserContext) => {
    try {
        /*const body = context.request.body({ type: "json" });
        const value = await body.value;*/
        let arg = {}
        if (new RegExp("^[0-9]{8,8}[A-Za-z]$").test(context.params?.param)){
            arg = { DNI: context.params?.param }
        } else if (new RegExp("[0-9]{9}").test(context.params?.param)) {
            arg = { telephone: context.params?.param }
        } else if (new RegExp("^[\w-.]+@([\w-]+.)+[\w-]{2,4}$").test(context.params?.param)) {
            arg = { email: context.params?.param }
        } else if (new RegExp("([a-zA-Z]{2})\s\t(\d{2})\s\t(\d{4})\s\t(\d{4})\s\t(\d{2})\s\t(\d{10})").test(context.params?.param)) {
            arg = { IBAN: context.params?.param }
        } else {
            arg = { _id: context.params?.param }
        }
        const user = await UserCollection.findOne(arg);
        if (!user) {
            context.response.status = 400;
            context.response.body = {
                message: "User is not in DB",
            };
            return;
        } else {
            context.response.body = user;
        };
        

    } catch (e) {
        console.log("Error en el programa");
    }

} 