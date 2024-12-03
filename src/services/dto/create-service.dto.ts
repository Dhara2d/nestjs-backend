import { IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  serviceProviders: string[];
}
