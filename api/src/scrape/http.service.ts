import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import Bottleneck from 'bottleneck';

Injectable();
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private readonly BASE_URL = `https://www.metal-archives.com`;
  private readonly client = axios.create({ baseURL: this.BASE_URL });
  private readonly limiter = new Bottleneck({
    minTime: 100
  });

  public constructor() {
    this.client.interceptors.response.use(null, async (error: AxiosError) => {
      this.logger.warn(error.message);
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(axios(error.config)), 2500);
      });
    });
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async get(url: string) {
    await this.sleep(200);
    return this.client.get(url);
    // return this.limiter.schedule(() => this.client.get(url));
  }
}
