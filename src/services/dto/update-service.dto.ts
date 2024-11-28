import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
