import { IsNotEmpty, IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateAppointmentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

  @IsMongoId()
  @IsNotEmpty()
  providerId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
