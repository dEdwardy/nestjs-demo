export interface ListOptionsInterface {
    categories: string;
    tags:string;
    limit:number;
    page:number;
    sort:string;
    order:Order.A | Order.D;
}

export const enum Order{
    A = 'ASC',
    D = 'DESC'
}