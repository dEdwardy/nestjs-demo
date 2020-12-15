import { Body, Controller, Delete, Get, Post,Put } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { routesDto } from './routes.dto';
import { RoutesService } from './routes.service';

@ApiUseTags('routes')
@Controller('api/routes')
export class RoutesController {
    constructor(private readonly routesService:RoutesService){

    }
    @Post()
    addRoute( @Body() data:routesDto){
        return  this.routesService.store(data)
    }
    @Put()
    updateRoute( @Body() data:routesDto){
        return  this.routesService.updateRoute(data)
    }
    @Delete()
    delteRoute(@Body() id:number){
        return this.routesService.delteRoute(id)
    }
    @Get()
    getRoutes(){
        return  this.routesService.getAll()
    }
    @Get('/tree')
    getTree(){
        return  this.routesService.getRoutesTree()
    }
}
