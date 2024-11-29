import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
} from './entities/appointment.entity';
import { Model, Types } from 'mongoose';
import { ServiceProvider } from '../service-providers/entities/service-provider.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointment: Model<AppointmentDocument>,
    @InjectModel(ServiceProvider.name)
    private readonly serviceProviderModel: Model<ServiceProvider>,
  ) {}
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment | []> {
    const { providerId, serviceId, date, time, userId } = createAppointmentDto;
    const service = await this.serviceProviderModel.findById(providerId);
    if (!service) {
      throw new NotFoundException('Service Provider not found');
    }

    // Check if the service provider offers the selected service
    if (!service.services.includes(new Types.ObjectId(serviceId))) {
      throw new NotFoundException('Service not offered by this provider');
    }

    const existingAppointment = await this.appointment.findOne({
      serviceProvider: new Types.ObjectId(providerId),
      date,
      time,
    });
    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    // Create and save the appointment
    const newAppointment = new this.appointment({
      userId: new Types.ObjectId(userId),
      service: new Types.ObjectId(serviceId),
      serviceProvider: new Types.ObjectId(providerId),
      date,
      time,
    });

    return newAppointment.save();
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
