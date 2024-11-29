// create-service-provider.dto.ts
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AddServicesToProviderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  services: string[];
}
