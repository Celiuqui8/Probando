export type User = {
    DNI: string;
    Nombre: string;
    Apellidos: string;
    Telefono: string;
    Email: string;
    IBAN: string;
};
export type Transactions = {
    ID_Sender: number;
    ID_Receiver: number;
    amount: number;
}