// dto/get-appointments.dto.ts
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { AppointmentStatus } from '../enum/appointment.enum';

export class GetAppointmentsDto {
  @IsOptional()
  @IsMongoId()
  serviceId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  serviceProviderId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: string;
}
