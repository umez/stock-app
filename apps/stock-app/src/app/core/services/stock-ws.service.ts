import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockWsService {
  private socket: Socket;
  private subject = new BehaviorSubject<any[]>([]);

  stocks$ = this.subject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('stocks', (data) => {
      this.subject.next(data);
    });
  }
}
