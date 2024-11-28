import {
  IsArray,
  IsEmail,
  IsString,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateServiceProviderDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsMongoId({ each: true })
  services: [{ type: Types.ObjectId; ref: 'service' }];
}
