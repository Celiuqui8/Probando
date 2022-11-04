import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "oak/router.ts";
import { TransactionsCollection, UserCollection } from "../db/database.ts";
import { TransactionSchema, UserSchema } from "../db/schemas.ts";
type AddUserContext = RouterContext<"/addUser",
    Record<string | number, string | undefined>,
    Record<string, any>
>;
type AddTransactionContext = RouterContext<
    "/addTransaction", 
    {
        value: string;
    } &
    Record<string | number, string | undefined>,
    Record<string, any>
>;

/*export const addUser = async (context: AddUserContext) => {
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
            new RegExp("^[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(value.email)
            
        /*if (!correct) {
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

} */
export const addUser = async (context: AddUserContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.Email && value?.Nombre && value?.Apellidos && value?.Telefono && value?.DNI)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }
        const isEverythingGood = new RegExp("^[0-9]{8,8}[A-Za-z]$").test(value.DNI) && new RegExp("[0-9]{9}").test(value.Telefono)
            && new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(value.Email)

        if (!isEverythingGood) {
            context.response.status = 422;
            context.response.body = { message: "Bad format on DNI, telephone or email" }
            return;
        }
        if (await UserCollection.findOne({ $or: [{ Email: value.Email }, { Nombre: value.Nombre }, { Apellidos: value.Apellidos }, { Telefono: value.Telefono }, { DNI: value.DNI }] })) {
            context.response.status = 409;
            context.response.body = { message: "Already exists" };
            return
        }
        await UserCollection.insertOne(value as UserSchema);
        context.response.body = value
    } catch (error) {
        console.error(error)
    }
}
export const addTransaction = async(context: AddTransactionContext) => {
    try{
        const body = context.request.body({type: "json"});
        const value = await body.value;
        if(!value?.ID_Sender  || !value?.ID_Receiver || !value?.amount){
            context.response.body = 400;
            context.response.body = {
                message: "You need to specify ID_Sender, ID_Receiver and amount of money",
            }
            return;
        }
        const correcto = await UserCollection.findOne({
           _id: new ObjectId(value.ID_Sender),
        })
        if(correcto){
            const correcto2 = await UserCollection.findOne({
                _id: new ObjectId(value.ID_Receiver),
            })
            if(correcto2){
                await TransactionsCollection.insertOne(
                    value as TransactionSchema,
                );
                context.response.body = value;
            }
            else{
                context.response.status = 400;
                context.response.body = {
                    message: "There is no user with the ID of the receiver",
                }
                return;
            }
        }
        else{
            context.response.status = 400;
            context.response.body = {
                message: "There is no user with the ID of the sender",
            }
            return;
        }
    }
    catch(e){
        console.error(e);
        context.response.status = 500;
    }
}