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

@Injectable()
export class ServiceProvidersService {
  constructor(
    @InjectModel(ServiceProvider.name)
    private readonly ServiceProvider: Model<ServiceProviderDocument>,
  ) {}
  async create(
    serviceProvider: CreateServiceProviderDto,
  ): Promise<ServiceProvider> {
    const isServiceAlreadyExit = await this.ServiceProvider.findOne({
      email: serviceProvider.email,
    }).lean();
    if (isServiceAlreadyExit) {
      throw new UnauthorizedException(
        `Service Provider with this email ${serviceProvider.email} Already Exits`,
      );
    }
    console.log(serviceProvider);
    const createdService = new this.ServiceProvider(serviceProvider);
    return createdService.save();
  }

  async findAll(): Promise<ServiceProvider[]> {
    const serviceProviders = await this.ServiceProvider.aggregate([
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
    ]).exec();
    console.log(serviceProviders);
    return serviceProviders;
  }

  async findOne(id: string): Promise<ServiceProvider> {
    const service = await this.ServiceProvider.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service Provider with ID ${id} not found`);
    }
    return service;
  }

  async update(
    id: string,
    updateServiceProviderDto: UpdateServiceProviderDto,
  ): Promise<ServiceProvider> {
    const updatedService = await this.ServiceProvider.findByIdAndUpdate(
      id,
      updateServiceProviderDto,
      {
        new: true,
      },
    ).exec();
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }

  remove(id: string): Promise<ServiceProvider> {
    return this.ServiceProvider.findByIdAndDelete(id).exec();
  }
}
