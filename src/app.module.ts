import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';

const uri =
  'mongodb+srv://admin:admin@imagecluster.kfublcj.mongodb.net/?retryWrites=true&w=majority&appName=imageCluster';
@Module({
  imports: [MongooseModule.forRoot(uri), CatsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
