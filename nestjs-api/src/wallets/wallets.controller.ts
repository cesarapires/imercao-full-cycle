import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { WalletPresenter } from './wallet.presenter';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wallet = await this.walletsService.findOne(id);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return new WalletPresenter(wallet);
  }

  @Post(':id/assets')
  createWalletAsset(
    @Param('id') id: string,
    @Body() createWalletAssetDto: CreateWalletAssetDto,
  ) {
    createWalletAssetDto.walletId = id;
    return this.walletsService.createWalletAsset(createWalletAssetDto);
  }
}
