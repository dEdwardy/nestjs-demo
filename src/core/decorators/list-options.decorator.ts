import { createParamDecorator } from '@nestjs/common'
export const ListOptions = createParamDecorator((data,req) => {
    let { categories }= req.query;
    console.log(typeof categories)
    console.log(!!categories)
    if(categories){
        categories = categories.split('-')
    }
    return { categories }

});