import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { ServiceProvidersModule } from './service-providers/service-providers.module';

const uri =
  'mongodb+srv://admin:admin@imagecluster.kfublcj.mongodb.net/?retryWrites=true&w=majority&appName=imageCluster';
@Module({
  imports: [MongooseModule.forRoot(uri), CatsModule, AuthModule, ServicesModule, ServiceProvidersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
