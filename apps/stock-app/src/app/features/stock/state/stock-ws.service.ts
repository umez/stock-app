import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StockWsService {
  private socket!: Socket;
  private subject = new BehaviorSubject<any[]>([]);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private retryCount = 0;
  private maxRetries = 30;
  connection$ = this.connectionStatus.asObservable();
  stocks$ = this.subject.asObservable();

  connectSocket() {
    this.socket = io('http://localhost:3000', {
      reconnection: true
    });
    this.socket.on('connect', () => {
      console.log('connected')
      this.retryCount = 0;
      this.connectionStatus.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected')
      this.connectionStatus.next(false);
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
