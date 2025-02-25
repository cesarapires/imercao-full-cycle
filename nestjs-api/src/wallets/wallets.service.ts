import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { WalletAsset } from './entities/wallet-asset.entity';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    // eslint-disable-next-line prettier/prettier
    @InjectModel(WalletAsset.name) private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    return this.walletSchema.create(createWalletDto);
  }

  findAll() {
    return this.walletSchema.find();
  }

  findOne(id: string) {
    return this.walletSchema.findById(id).populate([
      {
        path: 'assets', //walletasset
        populate: ['asset'],
      },
    ]) as Promise<
      (Wallet & { assets: (WalletAsset & { asset: Asset })[] }) | null
    >;
  }

  async createWalletAsset(createWalletAssetDto: CreateWalletAssetDto) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const docs = await this.walletAssetSchema.create(
        [
          {
            wallet: createWalletAssetDto.walletId,
            asset: createWalletAssetDto.assetId,
            shares: createWalletAssetDto.shares,
          },
        ],
        { session },
      );

      const walletAsset = docs[0];

      await this.walletSchema.updateOne(
        { _id: createWalletAssetDto.walletId },
        { $push: { assets: walletAsset._id } },
        { session },
      );

      await session.commitTransaction();

      return walletAsset;
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
