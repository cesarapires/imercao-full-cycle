import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import crypto from 'crypto';
import { HydratedDocument } from 'mongoose';

//Interface for Asset document to use functions like save, delete, etc
export type AssetDocument = HydratedDocument<Asset>;

//Schema for Asset entity
@Schema()
export class Asset {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({ unique: true, index: true })
  name: string;

  @Prop({ unique: true, index: true })
  symbol: string;

  @Prop()
  image: string;

  @Prop()
  price: string;

  createdAt!: Date;
  updatedAt!: Date;
}

//Schema from connection to database
export const AssetSchema = SchemaFactory.createForClass(Asset);
