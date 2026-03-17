import {Get, Injectable} from '@nestjs/common';





@Injectable()
export class AppService {
  @Get("/health")
  getHello(): Record<string, string> {
    return {message: "My health is Ok, Why Ask? 🤔"};
  }
}
