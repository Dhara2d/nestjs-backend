import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './entities/service.entity';
import { Model, Types } from 'mongoose';
import { AddServiceProvidersToServiceDto } from './dto/add-serviceprovider-to-service.dto';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { Role } from 'src/roles/roles.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private service: Model<ServiceDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(service: CreateServiceDto): Promise<Service> {
    const isServiceAlreadyExit = await this.service.findOne({
      name: service.name,
    });
    if (isServiceAlreadyExit) {
      throw new UnauthorizedException(
        `Service with this name ${service.name} Already Exits`,
      );
    }
    const createdService = new this.service(service);
    return createdService.save();
  }

  async findAll(): Promise<Service[]> {
    const result = await this.service.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'serviceProviders',
          foreignField: '_id',
          as: 'serviceProviders',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          serviceProviders: {
            $map: {
              input: '$serviceProviders',
              as: 'serviceProvider',
              in: {
                _id: '$$serviceProvider._id',
                name: '$$serviceProvider.name',
              },
            },
          },
        },
      },
    ]);

    return result;
  }

  async findOne(id: string): Promise<Service> {
    const result = await this.service.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'serviceProviders',
          foreignField: '_id',
          as: 'serviceProviders',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          serviceProviders: {
            $map: {
              input: '$serviceProviders',
              as: 'serviceProvider',
              in: {
                _id: '$$serviceProvider._id',
                name: '$$serviceProvider.name',
              },
            },
          },
        },
      },
    ]);

    return result[0];
  }

  async update(id: string, updateService: UpdateServiceDto): Promise<Service> {
    console.log(updateService);
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

  async addServiceProvidersToService(
    id: string,
    serviceProvidersDto: AddServiceProvidersToServiceDto,
  ): Promise<Service> {
    const { serviceProviders } = serviceProvidersDto;
    const availableService = await this.service.findById(id).exec();
    if (!availableService) {
      throw new NotFoundException(`Sevice with id ${id} not found`);
    }
    //check if the service providers are valid and available
    const validateServiceProviders = await this.userModel.find({
      _id: {
        $in: serviceProviders.map(
          (serviceProvider) => new Types.ObjectId(serviceProvider),
        ),
      },
      role: Role.SERVICE_PROVIDER,
    });

    if (validateServiceProviders.length !== serviceProviders.length) {
      throw new BadRequestException('Invalid Service Providers');
    }

    const newServices = validateServiceProviders.filter(
      (serviceProvider) =>
        !availableService.serviceProviders.includes(serviceProvider._id),
    );
    if (newServices.length === 0) {
      throw new BadRequestException('Service Providers has been already added');
    }

    availableService.serviceProviders.push(
      ...serviceProviders.map(
        (serviceProvider) => new Types.ObjectId(serviceProvider),
      ),
    );
    return availableService.save();
  }

  async removeServiceProvidersToService(
    id: string,
    serviceProvidersDto: AddServiceProvidersToServiceDto,
  ): Promise<Service> {
    const { serviceProviders } = serviceProvidersDto;
    const availableService = await this.service.findById(id).exec();
    if (!availableService) {
      throw new NotFoundException(`Sevice with id ${id} not found`);
    }
    //check if the service providers are valid and available
    const validateServiceProviders = await this.userModel.find({
      _id: {
        $in: serviceProviders.map(
          (serviceProvider) => new Types.ObjectId(serviceProvider),
        ),
      },
      role: Role.SERVICE_PROVIDER,
    });

    return availableService.save();
  }
}
