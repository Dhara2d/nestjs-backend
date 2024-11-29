import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { ServiceProvidersModule } from './service-providers/service-providers.module';
import { AppointmentsModule } from './appointments/appointments.module';

const uri =
  'mongodb+srv://admin:admin@imagecluster.kfublcj.mongodb.net/?retryWrites=true&w=majority&appName=imageCluster';
@Module({
  imports: [
    MongooseModule.forRoot(uri),
    AuthModule,
    ServicesModule,
    ServiceProvidersModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
