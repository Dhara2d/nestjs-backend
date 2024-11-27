import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World From dockerized image running on EC2 machine';
  }

  getHelp(): string {
    return 'Help route';
  }
}
