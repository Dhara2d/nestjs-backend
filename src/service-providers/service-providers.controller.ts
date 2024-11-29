import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { AddServicesToProviderDto } from './dto/add-services-to-provider.dto';

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  create(@Body() createServiceProviderDto: CreateServiceProviderDto) {
    return this.serviceProvidersService.create(createServiceProviderDto);
  }

  @Get()
  findAll() {
    return this.serviceProvidersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProvidersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceProviderDto: UpdateServiceProviderDto,
  ) {
    return this.serviceProvidersService.update(id, updateServiceProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceProvidersService.remove(id);
  }

  @Put(':id/add-services')
  addServices(
    @Param('id') serviceProviderId: string,
    @Body() addServicesDto: AddServicesToProviderDto,
  ) {
    return this.serviceProvidersService.addServicesToProvider(
      serviceProviderId,
      addServicesDto,
    );
  }

  @Delete(':id/remove-services')
  async removeServicesFromProvider(
    @Param('id') id: string,
    @Body() removeServicesDto: AddServicesToProviderDto,
  ) {
    return this.serviceProvidersService.removeServicesFromProvider(
      id,
      removeServicesDto,
    );
  }
}
