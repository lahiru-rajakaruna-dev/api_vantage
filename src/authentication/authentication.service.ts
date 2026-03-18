import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	InternalServerErrorException,
}                                     from '@nestjs/common';
import {ConfigService}                from '@nestjs/config';
import jwt                            from 'jsonwebtoken';
import {v4 as _uuid}                  from 'uuid';
import {OrganizationService}          from '../business_logic/organization/organization.service';
import type ILoggerService            from '../logger/logger.interface';
import {TOKEN__LOGGER_FACTORY}        from '../logger/logger_factory/logger_factory.service';
import {ISessionStore}                from '../session_store/interface.session_store.service';
import {NodeCacheSessionStoreService} from '../session_store/node_cache.session_store/node_cache.session_store.service';
import {EEnvVars}                     from '../types';



@Injectable()
export class AuthenticationService {
	private readonly logger: ILoggerService;
	private readonly organizationService: OrganizationService;
	private readonly sessionStore: ISessionStore;
	private readonly configService: ConfigService;

	constructor(
		configService: ConfigService,
		organizationService: OrganizationService,
		sessionStore: NodeCacheSessionStoreService,
		@Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
	) {
		this.configService       = configService;
		this.organizationService = organizationService;
		this.logger              = logger;
		this.sessionStore        = sessionStore;
	}

	async isRegistered(userId: string): Promise<boolean> {
		const organization =
				  await this.organizationService.getOrganizationDetailsByAdmin(userId);
		return organization !== undefined;
	}

	async authenticate(userId: string) {
		try {
			const organization =
					  await this.organizationService.getOrganizationDetailsByAdmin(userId);

			if (!organization) {
				throw new AuthenticationServiceException('Organization not found');
			}

			const sessionId = _uuid();

			this.sessionStore.setSession(sessionId, organization);

			const token = jwt.sign(
				{
					sessionId,
				},
				this.configService.get(EEnvVars.JWT_SECRET_KEY) as string,
				{
					expiresIn: 1000 * 60 * 60 * 24,
				},
			);

			return token;
		} catch (e) {
			if (e instanceof AuthenticationServiceException) {
				this.logger.log(e.message);
				throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
			}
			throw new InternalServerErrorException(e);
		}
	}

	async signOut(sessionId: string) {
		this.sessionStore.deleteSession(sessionId);
		return true;
	}
}



class AuthenticationServiceException extends Error {
	constructor(message: string) {
		super(message);
	}
}
