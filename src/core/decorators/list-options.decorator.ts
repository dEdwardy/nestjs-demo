import { createParamDecorator } from '@nestjs/common'
import { ListOptionsInterface, Order } from '../interfaces/list-options.interface';
export const ListOptions = createParamDecorator((data: Partial<ListOptionsInterface> = { },req) => {
    let { categories, tags, limit, page, sort, order }= req.query;
    if(categories){
        categories = categories.split('-')
    }

    if(tags){
        tags = tags.split('-') 
    }

    if(page){
        page = parseInt(page)
    }else{
        page = 1;
    }

    if(limit) {
        limit = parseInt(limit);
    }else if(!limit && data.limit) {
        limit = data.limit;
    }else{
        limit = 1;
    }

    if(sort) {
        sort = sort;
    }else {
        sort = data.sort ||'created';
    }

    if(order) {
        order = order.toUpperCase()==Order.ASC ? Order.ASC : Order.DESC;
    }else {
        order = Order.DESC;
    }
    return { categories, tags, limit, page }

});