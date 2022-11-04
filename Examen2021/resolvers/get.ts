// deno-lint-ignore-file no-constant-condition
import { digestAlgorithms } from "https://deno.land/std@0.154.0/_wasm_crypto/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { DBRef } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { RouterContext } from "oak/router.ts";
import { ReservasCollection } from "../db/database.ts";
import { Reserva } from "../types.ts";
type GetFreeSeatsContext = RouterContext<
  "/freeseats",
 Record<string | number, string | undefined>,
  Record<string, any>
>;
type GetReservaStatusContext = RouterContext<"/getStatus",
    & Record<string | number, string | undefined>, Record<string, any>>;

// deno-lint-ignore require-await
export const getStatus = async (context: GetReservaStatusContext) => {
    try {
       const date = new Date();
        context.response.status = 200
        context.response.body = {
            body: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        };
        
    } catch (e) {
        context.response.status = 500;
        context.response.body = "Algo fue mal";
    }
}

//get thorught params day, month, year and return free seats
export const getFreeSeats = async (context: GetFreeSeatsContext) => {
    try {
        const query = getQuery(context, { mergeParams: true });
        const day = query.day;
        const month = query.month;
        const year = query.year;
        const date = new Date(`${year}-${month}-${day}`);
        const reservas = await ReservasCollection.find({}).toArray();
        if (!day && !month && !year) {
            context.response.status = 400;
            context.response.body = "Faltan parametros";
            return;
        }
        //invalid date catch error
        if (isNaN(date.getTime())) {
            context.response.status = 400;
            context.response.body = "Fecha invalida";
            return;
        }
        

        /*const reservasFiltradas = reservas.filter((reserva) => {
            const fechaReserva = new Date(reserva.date);
            return fechaReserva.getDate() === date.getDate() &&

                fechaReserva.getMonth() === date.getMonth() &&
                fechaReserva.getFullYear() === date.getFullYear();
        });
        const asientosOcupados = reservasFiltradas.map((reserva) => reserva.asiento);
        const asientosLibres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((asiento) => !asientosOcupados.includes(asiento));

        context.response.status = 200;
        context.response.body = {
            asientosLibres,
        };*/
    }
    catch (e) {
        context.response.status = 500;
        context.response.body = "Algo fue mal";
    }
};


/*export const getFreeSeats = async (context: GetFreeSeatsContext) => {
    try {
        
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.fecha) {
            context.response.status = 400;
            return;
        }
        const fecha = new Date(value.fecha);
        const reservas = await ReservasCollection.find({ fecha: fecha });
        const reservasArray = await reservas.toArray();
        if (!value.dia && !value.mes && !value.anio) {
            context.response.status = 500;
            return;
        }
  } catch (e) {
    console.error(e);
    context.response.status = 505;
  }
};
*/