import {Injectable} from '@nestjs/common';



@Injectable()
export class AppService {
	getHello(): Record<string, string> {
		return {message: 'My health is Ok, Why Ask? 🤔'};
	}
}
