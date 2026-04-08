import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

import { from, lastValueFrom, timer } from 'rxjs';
import { mergeMap, map, retry, toArray, catchError } from 'rxjs/operators';
import { StockModel } from './stock.interface';

@Injectable()
export class StockService {
  private symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

  private failureCount = 0;
  private successCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  private failureThreshold = 5;
  private successThreshold = 2;
  private timeout = 5000;

  constructor(private config: ConfigService) { }

  private apiKey = this.config.get<string>('FINNHUB_KEY')!;

  async getStocks() {
    return await lastValueFrom(
      from(this.symbols).pipe(

        mergeMap(
          symbol => this.fetchStock$(symbol),
          2 // tuned concurrency
        ),
        // collect all results into array
        toArray()
      )
    );
  }

  private fetchStock$(symbol: string) {

    if (this.state === 'OPEN') {
      console.warn('Circuit OPEN - skipping request');
      const cached = this.cache.get(symbol);

        return from([
          cached ?? {
            symbol,
            current: null,
            high: null,
            low: null
          }
        ]);
    }

    return from(
      axios.get('https://finnhub.io/api/v1/quote', {
        params: { symbol, token: this.apiKey }
      })
    ).pipe(
      map(res => {

        // console.log({symbol: symbol, data: res.data})

         const data = new StockModel(
          symbol,
          res.data.c,
          res.data.d,
          res.data.dp,
          res.data.h,
          res.data.l,
          res.data.o,
          res.data.pc,
          res.data.t
        );

        // store last successful value
        this.cache.set(symbol, data);
        this.onSuccess();

        return data
      }),

      retry({
        count: 3,
        delay: (error: AxiosError, retryCount) => {

          const isNetworkError = !error.response;
          const status = error.response?.status;

          if ( this.state === 'OPEN' ||       // circuit already open
                isNetworkError ||    // API unreachable
                !(status === 429 || status! >= 500)) {
            throw error;
          }

          const backoff = Math.pow(2, retryCount) * 500;
          return timer(backoff);
        }
      }),

      // If all retries fail
      catchError(err => {
        this.onFailure();

        return from([
          {
            symbol,
            current: null,
            high: null,
            low: null
          }
        ]);
      })
    );
  }

  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;

      if (this.successCount >= this.successThreshold) {
        // console.log('Circuit CLOSED again');

        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure() {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      console.error('Circuit OPEN');

      this.state = 'OPEN';

      setTimeout(() => {
        console.log('Circuit HALF_OPEN');

        this.state = 'HALF_OPEN';
        this.successCount = 0;
      }, this.timeout);
    }
  }

  // Cache the last emmitted data
  private cache = new Map<string, {
    symbol: string;
    current: number | null;
    change: number | null;
    percentChange: number | null;
    high: number | null;
    low: number | null;
    open: number | null;
    previousClose: number | null;
    timestamp: number | null


  }>();
}
