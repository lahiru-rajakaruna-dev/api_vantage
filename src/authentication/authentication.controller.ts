import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Req,
	Request,
	Res,
}                              from '@nestjs/common';
import {ConfigService}         from '@nestjs/config';
import {e}                     from '../../application';
import type ILoggerService     from '../logger/logger.interface';
import {TOKEN__LOGGER_FACTORY} from '../logger/logger_factory/logger_factory.service';
import {AuthenticationService} from './authentication.service';



type NestRequest = e.NestRequest;
type NestResponse = e.NestResponse;



@Controller('auth')
export class AuthenticationController {
	private logger: ILoggerService;
	private configService: ConfigService;
	private authenticationService: AuthenticationService;

	constructor(
		@Inject(TOKEN__LOGGER_FACTORY)
		logger: ILoggerService,
		configService: ConfigService,
		authenticationService: AuthenticationService,
	) {
		this.logger                = logger;
		this.configService         = configService;
		this.authenticationService = authenticationService;
	}

	@Get('/is_registered')
	async isRegistered(@Request() request: NestRequest) {
		const userId = request.cookies['user_id'];

		if (!userId) {
			throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
		}

		return await this.authenticationService.isRegistered(userId);
	}

	@Get('/authenticate')
	async authenticate(
		@Request()
		request: NestRequest,
		@Res({passthrough: true}) response: NestResponse,
	) {
		const userId = request.cookies['user_id'];
		if (!userId) {
			throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
		}

		const jwt = await this.authenticationService.authenticate(userId);
		response.cookie('access_token', jwt, {
			httpOnly: true,
			secure  : true,
			maxAge  : 1000 * 60 * 60 * 24,
			sameSite: 'strict',
			path    : '/',
		});

		return true;
	}

	@Get('/sign_out')
	async signOut(
		@Req() request: NestRequest,
		@Res({passthrough: true}) response: NestResponse,
	) {
		const sessionId = request.sessionId;
		if (!sessionId) {
			throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
		}

		await this.authenticationService.signOut(sessionId);
		response.cookie('access_token', '', {expires: 0, sameSite: 'strict'});

		return true;
	}
}
