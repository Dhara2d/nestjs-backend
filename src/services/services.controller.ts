import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthRolesGuard } from 'src/roles/roles.guard';
import { AddServiceProvidersToServiceDto } from './dto/add-serviceprovider-to-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthRolesGuard)
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthRolesGuard)
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Put(':id/add-serviceproviders')
  @Roles(Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  addServiceProviders(
    @Param('id') serviceProviderId: string,
    @Body() serviceProviders: AddServiceProvidersToServiceDto,
  ) {
    return this.servicesService.addServiceProvidersToService(
      serviceProviderId,
      serviceProviders,
    );
  }
}
