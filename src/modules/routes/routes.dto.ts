export enum menuStatus  {
    ON ='on',
    OFF = 'off'
}
export class routesDto {
    id?:number;
    parentId?:[number,null];
    type:string;
    icon:string;
    name:string;
    sort?:number;
    link:boolean;
    path:string;
    show:boolean;
    status:menuStatus;

}