import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import crypto from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';
import { WalletAsset, WalletAssetDocument } from './wallet-asset.entity';

//Interface for Wallet document to use functions like save, delete, etc
export type WalletDocument = HydratedDocument<Wallet>;

//Schema for Wallet entity
@Schema({ timestamps: true })
export class Wallet {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({
    type: [mongoose.Schema.Types.String],
    set: (v) => [...new Set(v)],
    ref: WalletAsset.name,
  })
  assets: WalletAssetDocument[] | string[];

  createdAt!: Date;
  updatedAt!: Date;
}

//Schema from connection to database
export const WalletSchema = SchemaFactory.createForClass(Wallet);
