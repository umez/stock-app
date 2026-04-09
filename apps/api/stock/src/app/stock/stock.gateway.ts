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
    let counter = 0
    setInterval(async () => {
      const data = await this.stockService.getStocks();
      // console.log({data, counter})
      counter++
      this.server.emit('stocks', data);
    }, 5000);
  }
}
