import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/database.ts";
type AddUserContext = RouterContext<"/addUser",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

/*export const addUser = async (context: AddUserContext) => {
    try {
        /*const body = context.request.body({ type: "json" });
        const value = await body.value;
        let arg = {};
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
    }
}*/
export const addUser = async (context: AddUserContext) => {
    try {
        const body = context.request.body({ type: "json" });
        const value = await body.value;
        if (!value.Email || !value.Nombre || !value.Apellidos || !value.Telefono || !value.DNI) {
            context.response.status = 400;
            context.response.body = {
                message: "You ara missing information"
            }
        }
        const correct: boolean = new RegExp("^[0-9]{8,8}[A-Za-z]$").test(value.DNI) &&
            new RegExp("[0-9]{9}").test(value.telefono) && 
            new RegExp("^[\w-.]+@([\w-]+.)+[\w-]{2,4}$").test(value.email) &&
            new RegExp("([a-zA-Z]{2})\s\t(\d{2})\s\t(\d{4})\s\t(\d{4})\s\t(\d{2})\s\t(\d{10})").test(value.IBAN);
        if (!correct) {
           context.response.status = 400;
            context.response.body = {
                message: "You need to enter the right format of the information"
            }
            return; 
        } else {
            const found = await UserCollection.findOne(value);
            if (found) {
                context.response.status = 400;
                context.response.body = {
                message: "User is already in DB",
            };
            return;
            }
            await UserCollection.insertOne({
            ...value,
        });
        context.response.body = {
            ...value,
        };
            
        }
        
    } catch (e) {
        console.log("Error en el programa");
    }

} 