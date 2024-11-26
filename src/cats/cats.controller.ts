import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CatsService } from './cats.service';

@Controller('cats')
@UseGuards(AuthGuard('jwt'))
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: any) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: any) {
    console.log(updateCatDto);
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }

  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT
  @Get('profile')
  getProfile() {
    return { message: 'This is a secured route' };
  }
}
