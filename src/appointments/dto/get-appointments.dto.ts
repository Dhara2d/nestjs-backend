// dto/get-appointments.dto.ts
import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class GetAppointmentsDto {
  @IsOptional()
  @IsMongoId()
  serviceId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  providerId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;
}
