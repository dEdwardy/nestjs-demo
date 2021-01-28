import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagDto } from './tag.dto';

@Controller('tags')
@ApiUseTags('Tags')
@UseInterceptors(ClassSerializerInterceptor)
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async store(@Body() data: TagDto) {
    return await this.tagService.store(data);
  }
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: TagDto) {
    return await this.tagService.update(id, data);
  }
  @Delete(':id')
  async destory(@Param('id', ParseIntPipe) id: number) {
    return await this.tagService.destroy(id);
  }
  @Get()
  async find() {
    return await this.tagService.find();
  }
}
