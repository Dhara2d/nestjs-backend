import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema()
export class Service {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
