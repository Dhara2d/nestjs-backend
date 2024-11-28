import { Module } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersController } from './service-providers.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from './entities/service-provider.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ServiceProvider.name,
        schema: ServiceProviderSchema,
      },
    ]),
  ],
  controllers: [ServiceProvidersController],
  providers: [ServiceProvidersService],
})
export class ServiceProvidersModule {}
