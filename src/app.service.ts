import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const promise = new Promise<string>((res, rej) => {
      setTimeout(() => {
        res('Hello World!!');
      }, 2000);
    });
    return await promise;
  }

  getHelp(): string {
    return 'Help route';
  }
}
