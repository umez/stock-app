
import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'apps/stock-app/src/environments/environment';

@Injectable()
export class StockWsService {
  private socket!: Socket;
  private retryCount = 0;
  private maxRetries = 30;

  connectionStatus = signal<boolean>(false);

  private subject = new BehaviorSubject<any[]>([]);
  stocks$ = this.subject.asObservable();

  connectSocket() {
    this.socket = io(environment.SOCKET_URL, {
      reconnection: true
    });
    this.socket.on('connect', () => {
      console.log('connected')
      this.retryCount = 0;
      this.connectionStatus.set(true);
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected')
      this.connectionStatus.set(false);
    });

    this.socket.on('stocks', (data) => {
      this.subject.next(data);
    });
    this.socket.io.on('reconnect_attempt', () => {
      this.retryCount++;
      console.log(`Retry ${this.retryCount}`);
      if(this.retryCount >= this.maxRetries) {
        this.disconnectSocket();
      }
    });
  }

  disconnectSocket() {
    this.socket.disconnect()
  }
}
