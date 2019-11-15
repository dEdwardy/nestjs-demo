export interface ListOptionsInterface {
    categories: string;
    tags:string;
    limit:number;
    page:number;
    sort:string;
    order:Order.ASC | Order.DESC;
}

export const enum Order{
    ASC = 'ASC',
    DESC = 'DESC'
}