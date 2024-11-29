import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './entities/service.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private service: Model<ServiceDocument>,
  ) {}
  async create(service: CreateServiceDto): Promise<Service> {
    const isServiceAlreadyExit = await this.service.findOne({
      name: service.name,
    });
    if (isServiceAlreadyExit) {
      throw new UnauthorizedException('Service Already Exits');
    }
    const createdService = new this.service(service);
    return createdService.save();
  }

  async findAll(): Promise<Service[]> {
    const services = await this.service.aggregate([
      {
        $lookup: {
          from: 'serviceproviders',
          localField: '_id',
          foreignField: 'services',
          as: 'providers',
        },
      },
      {
        $project: {
          __v: 0,
          'providers.__v': 0,
          'providers.services': 0,
          'providers.email': 0,
        },
      },
    ]);

    return services;
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.service.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: '_id',
          foreignField: 'services',
          as: 'providers',
        },
      },
      {
        $project: {
          __v: 0,
          'providers.__v': 0,
          'providers.services': 0,
          'providers.email': 0,
        },
      },
    ]);
    if (service.length === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service[0];
  }

  async update(id: string, updateService: UpdateServiceDto): Promise<Service> {
    const updatedService = await this.service
      .findByIdAndUpdate(id, updateService, {
        new: true,
      })
      .exec();
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }

  remove(id: string) {
    return this.service.findByIdAndDelete(id).exec();
  }
}
