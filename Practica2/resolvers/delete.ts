import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/database.ts";


type DeleteUserContext = RouterContext<"/deleteUser/:email", {
    email: string;
} & Record<string | number, string | undefined>, Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) => {
    try {
        let arg;
        if (new RegExp("^[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(context.params?.email)) {
            arg = {Email: context.params?.email }
            await UserCollection.deleteOne(arg);
            context.response.status = 200;
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