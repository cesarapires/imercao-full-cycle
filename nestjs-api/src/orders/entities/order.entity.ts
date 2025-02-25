import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import crypto from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';
import { Asset, AssetDocument } from 'src/assets/entities/asset.entity';
import { Wallet, WalletDocument } from 'src/wallets/entities/wallet.entity';

//Interface for Order document to use functions like save, delete, etc
export type OrderDocument = HydratedDocument<Order>;

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FAILDED = 'FAILED',
}

//Schema for Order entity
@Schema()
export class Order {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.Int32 })
  shares: number;

  @Prop({ type: mongoose.Schema.Types.Int32 })
  partial: number;

  @Prop({ type: mongoose.Schema.Types.Int32 })
  price: number;

  @Prop({ type: String, ref: Wallet.name })
  wallet: WalletDocument | string;

  @Prop({ type: String, ref: Asset.name })
  asset: AssetDocument | string;

  @Prop({ type: String, enum: OrderType })
  type: OrderType;

  @Prop({ type: String, enum: OrderStatus })
  status: OrderStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

//Schema from connection to database
export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ wallet: 1, asset: 1 }, { unique: true });
