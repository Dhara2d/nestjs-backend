import { Module } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersController } from './service-providers.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from './entities/service-provider.entity';
import { Service, ServiceSchema } from '../services/entities/service.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ServiceProvider.name,
        schema: ServiceProviderSchema,
      },
      {
        name: Service.name,
        schema: ServiceSchema,
      },
    ]),
  ],
  controllers: [ServiceProvidersController],
  providers: [ServiceProvidersService],
})
export class ServiceProvidersModule {}
