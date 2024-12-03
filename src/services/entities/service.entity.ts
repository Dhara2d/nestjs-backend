import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema()
export class Service {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  serviceProviders: Types.ObjectId[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
