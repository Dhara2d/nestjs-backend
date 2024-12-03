import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class AddServiceProvidersToServiceDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  serviceProviders: string[];
}
