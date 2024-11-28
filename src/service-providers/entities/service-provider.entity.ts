import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types, SchemaTypes } from 'mongoose';

export type ServiceProviderDocument = ServiceProvider & Document;

@Schema()
export class ServiceProvider {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Service', required: true })
  services: Types.ObjectId[];
}

export const ServiceProviderSchema =
  SchemaFactory.createForClass(ServiceProvider);
