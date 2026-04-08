import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockGateway } from './stock.gateway';

@Module({
  controllers: [],
  providers: [StockGateway, StockService]
})
export class StockModule {}
