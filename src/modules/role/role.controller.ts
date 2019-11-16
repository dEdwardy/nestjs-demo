import { Controller, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './role.dto';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Roles')
@Controller('roles')
export class RoleController {
    constructor(
        private readonly roleService:RoleService
    ){}
    @Post()
    async store(
        @Body() data:RoleDto
    ){
        return this.roleService.store(data);
    }
}
