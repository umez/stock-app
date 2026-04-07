import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class StockService {
  private symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

  constructor(private config: ConfigService) {}

  apiKey = this.config.get<string>('FINNHUB_KEY');

  async getStocks() {

    const results = await Promise.all(
      this.symbols.map(symbol =>
        this.fetchWithRetry(() => this.fetchStock(symbol))
      )
    );

    return results;
  }

  private async fetchStock(symbol: string) {
    const res = await axios.get(
      'https://finnhub.io/api/v1/quote',
      {
        params: {
          symbol,
          token: this.apiKey
        }
      }
    );

    return {
      symbol,
      current: res.data.c,
      high: res.data.h,
      low: res.data.l
    };
  }

  private async fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const err = error as AxiosError;
      const status = err.response?.status;
      // Retry only for rate limit or server errors
      if ((status === 429 || status! >= 500) && retries > 0) {
        console.warn(
          `Retrying... (${3 - retries + 1}) after ${delay}ms`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(fn, retries - 1, delay * 2); // exponential backoff
      }
      console.error('Request failed:', status);
      throw error;
    }
  }
}
