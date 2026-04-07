import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { StockService } from './stock.service';

@WebSocketGateway({ cors: true })
export class StockGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(private stockService: StockService) {}

  afterInit() {
    setInterval(async () => {
      const data = await this.stockService.getStocks();
      this.server.emit('stocks', data);
    }, 3000);
  }
}
