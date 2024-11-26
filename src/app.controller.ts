import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/help')
  getHelp(): string {
    return this.appService.getHelp();
  }

  @Post('/create')
  createItem(@Body() body: any): string {
    console.log('Received data:', body);
    return `Item created successfully! Received: ${JSON.stringify(body)}`;
  }
}
