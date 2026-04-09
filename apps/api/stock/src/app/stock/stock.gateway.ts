import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { StockService } from './stock.service';

@WebSocketGateway({ cors: true })
export class StockGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server!: Server;

  private intervalId: any;
  private clients = 0;

  constructor(private stockService: StockService) {}

  afterInit() {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    this.clients++;
    console.log('Client connected:', this.clients);

    if (this.clients === 1) {
      this.startStreaming();
    }
  }

  handleDisconnect(client: Socket) {
    this.clients--;
    console.log('Client disconnected:', this.clients);

    if (this.clients === 0) {
      this.stopStreaming();
    }
  }

  private startStreaming() {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      try {
        const data = await this.stockService.getStocks();
        this.server.emit('stocks', data);
      } catch (err) {
        console.error('Error fetching stocks:', err);
      }
    }, 5000);

    console.log('Streaming started');
  }

  private stopStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Streaming stopped');
    }
  }
}
