import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/database.ts";


type DeleteUserContext = RouterContext<"/deleteUser/:email", {
    email: string;
} & Record<string | number, string | undefined>, Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) => {
    try {
        //const email = context.params?.email;
        let arg;
        if (new RegExp("^[\w-.]+@([\w-]+.)+[\w-]{2,4}$").test(context.params?.email)) {
            arg = {email: context.params?.param }
            await UserCollection.deleteOne(arg);
        } else {
            context.response.status = 404;
            context.response.body = {
                message: "User not found",
            }
        }
        context.response.status = 200;
    } catch (e) {
        console.error(e);
        context.response.status = 500;
    }
}