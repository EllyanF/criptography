export type TransactionRecord = {
    id?: number,
    userDocument: string,
    creditCardToken: string,
    value: number,
    [key: string]: string | number | undefined
}