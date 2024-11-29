import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ServiceProvider,
  ServiceProviderDocument,
} from './entities/service-provider.entity';
import { Model, Types } from 'mongoose';
import { AddServicesToProviderDto } from './dto/add-services-to-provider.dto';
import { Service, ServiceDocument } from '../services/entities/service.entity';

@Injectable()
export class ServiceProvidersService {
  constructor(
    @InjectModel(ServiceProvider.name)
    private readonly serviceProvider: Model<ServiceProviderDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}
  async create(
    serviceProvider: CreateServiceProviderDto,
  ): Promise<ServiceProvider> {
    const isServiceAlreadyExit = await this.serviceProvider
      .findOne({
        email: serviceProvider.email,
      })
      .lean();
    if (isServiceAlreadyExit) {
      throw new UnauthorizedException(
        `Service Provider with this email ${serviceProvider.email} Already Exits`,
      );
    }
    const createdService = new this.serviceProvider(serviceProvider);
    return createdService.save();
  }

  async findAll(): Promise<ServiceProvider[]> {
    const serviceProviders = await this.serviceProvider
      .aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'services',
            foreignField: '_id',
            as: 'serviceDetails',
          },
        },
        {
          $project: {
            name: 1,
            services: {
              $map: {
                input: '$serviceDetails',
                as: 'service',
                in: {
                  id: '$$service._id',
                  name: '$$service.name',
                },
              },
            },
          },
        },
      ])
      .exec();
    return serviceProviders;
  }

  async findOne(id: string): Promise<ServiceProvider> {
    const service = await this.serviceProvider.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service Provider with ID ${id} not found`);
    }
    return service;
  }

  async update(
    id: string,
    updateServiceProviderDto: UpdateServiceProviderDto,
  ): Promise<ServiceProvider> {
    const updatedService = await this.serviceProvider
      .findByIdAndUpdate(id, updateServiceProviderDto, {
        new: true,
      })
      .exec();
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }

  remove(id: string): Promise<ServiceProvider> {
    return this.serviceProvider.findByIdAndDelete(id).exec();
  }

  async addServicesToProvider(
    id: string,
    addServicesDto: AddServicesToProviderDto,
  ): Promise<ServiceProvider> {
    const { services } = addServicesDto;
    const serviceProvider = await this.serviceProvider.findById(id).exec();
    if (!serviceProvider)
      throw new NotFoundException(`Service provider with id ${id} not found`);

    const validServices = await this.serviceModel.find({
      _id: { $in: services.map((service) => service) },
    });
    if (validServices.length !== services.length) {
      throw new NotFoundException('Some services do not exist');
    }

    const newServices = validServices.filter(
      (service) => !serviceProvider.services.includes(service._id),
    );

    if (newServices.length === 0) {
      throw new NotFoundException('All services are already added');
    }
    serviceProvider.services.push(
      ...validServices.map((service) => service._id),
    );
    return serviceProvider.save();
  }

  async removeServicesFromProvider(
    id: string,
    removeServicesDto: AddServicesToProviderDto,
  ): Promise<ServiceProvider> {
    const { services } = removeServicesDto;

    const serviceProvider = await this.serviceProvider.findById(id).exec();
    if (!serviceProvider)
      throw new NotFoundException(`Service provider with id ${id} not found`);

    const servicesToRemove = serviceProvider.services.filter((serviceId) =>
      services.includes(serviceId.toString()),
    );

    if (servicesToRemove.length === 0) {
      throw new NotFoundException(
        'None of the specified services are linked to this provider.',
      );
    }

    // Remove services from the provider's services array
    serviceProvider.services = serviceProvider.services.filter(
      (serviceId) => !services.includes(serviceId.toString()),
    );

    // Save the updated service provider
    return serviceProvider.save();
  }
}
