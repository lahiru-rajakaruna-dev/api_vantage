import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
}                      from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import jwt             from 'jsonwebtoken';
import {e}             from '../../../application';
import NestRequest = e.NestRequest;
import NestResponse = e.NestResponse;



@Injectable()
export class AuthMiddlewareService implements NestMiddleware {
	private readonly configService: ConfigService;

	constructor(configService: ConfigService) {
		this.configService = configService;
	}

	use(req: NestRequest, res: NestResponse, next: (error?: Error) => void): any {
		const {cookies} = req;
		const token     = cookies['access_token'];

		if (!token) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED, {
				cause: 'Not logged in',
			});
		}

		const decodedToken = jwt.verify(
			token,
			this.configService.get('JWT_SECRET_KEY')!,
			{
				complete: true,
			},
		);
		const sessionId    = decodedToken.payload['token'];

		if (!decodedToken.payload || !sessionId) {
			throw new HttpException('Token tampered...', HttpStatus.UNAUTHORIZED);
		}

		req.sessionId = sessionId;
		next();
	}
}
