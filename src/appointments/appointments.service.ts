import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { Service, ServiceDocument } from 'src/services/entities/service.entity';
import { Role } from 'src/roles/roles.enum';
import { AppointmentStatus } from './enum/appointment.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment | []> {
    const { serviceProviderId, serviceId, date, time, userId } =
      createAppointmentDto;
    //check if the user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User is not found');

    //check if the service provider exits and role is service provider
    const serviceProvider = await this.userModel.findById(userId).exec();

    if (!serviceProvider || serviceProvider.role === Role.SERVICE_PROVIDER)
      throw new BadRequestException('Invalid Service Provider');

    //check if the service exits
    const service = await this.serviceModel.findById(serviceId).exec();

    if (!service) throw new NotFoundException('Service is not found');

    //check if the service is provided by the service providers
    if (
      !service.serviceProviders.includes(new Types.ObjectId(serviceProviderId))
    )
      throw new BadRequestException(
        'Service is not provided by the service provider',
      );

    //check if the time, date and service provider available

    const existingAppointment = await this.appointmentModel.findOne({
      serviceProvider: new Types.ObjectId(serviceProviderId),
      date,
      time,
    });

    if (existingAppointment)
      throw new ConflictException('This time slot is already booked');

    // Create and save the appointment
    const newAppointment = new this.appointmentModel({
      userId: new Types.ObjectId(userId),
      service: new Types.ObjectId(serviceId),
      serviceProvider: new Types.ObjectId(serviceProviderId),
      date,
      time,
    });

    return newAppointment.save();
  }

  async findAll(filters: GetAppointmentsDto): Promise<Appointment[]> {
    const { serviceId, providerId, userId, status } = filters;

    const query: any = {};
    if (serviceId) query.service = new Types.ObjectId(serviceId);
    if (providerId) query.serviceProvider = new Types.ObjectId(providerId);
    if (userId) query.userId = new Types.ObjectId(userId);
    if (status) query.status = status;

    return this.appointmentModel
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

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    serviceProviderId: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(
      new Types.ObjectId(appointmentId),
    );

    if (!appointment) throw new NotFoundException('Appointment not available');

    const serviceProvider = await this.userModel.find({
      id: serviceProviderId,
      role: Role.SERVICE_PROVIDER,
    });

    if (!serviceProvider)
      throw new BadRequestException('Invalid Service Provider');

    appointment.status = status;
    return appointment.save();
  }
}
