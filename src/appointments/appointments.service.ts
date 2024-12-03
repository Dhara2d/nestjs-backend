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
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointment: Model<AppointmentDocument>,
  ) {}
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment | []> {
    // const { providerId, serviceId, date, time, userId } = createAppointmentDto;
    // const service = await this.serviceProviderModel.findById(providerId);
    // if (!service) {
    //   throw new NotFoundException('Service Provider not found');
    // }

    // Check if the service provider offers the selected service
    // if (!service.services.includes(new Types.ObjectId(serviceId))) {
    //   throw new NotFoundException('Service not offered by this provider');
    // }

    // const existingAppointment = await this.appointment.findOne({
    //   serviceProvider: new Types.ObjectId(providerId),
    //   date,
    //   time,
    // });
    // if (existingAppointment) {
    //   throw new ConflictException('This time slot is already booked');
    // }

    // Create and save the appointment
    // const newAppointment = new this.appointment({
    //   userId: new Types.ObjectId(userId),
    //   service: new Types.ObjectId(serviceId),
    //   serviceProvider: new Types.ObjectId(providerId),
    //   date,
    //   time,
    // });

    return [];
  }

  async findAll(filters: GetAppointmentsDto): Promise<Appointment[]> {
    const { serviceId, providerId, userId } = filters;

    const query: any = {};
    if (serviceId) query.service = new Types.ObjectId(serviceId);
    if (providerId) query.serviceProvider = new Types.ObjectId(providerId);
    if (userId) query.userId = new Types.ObjectId(userId);

    return this.appointment
      .find(query)
      .populate('service', 'name')
      .populate('serviceProvider', 'name')
      .populate('userId', 'name')
      .exec();
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
