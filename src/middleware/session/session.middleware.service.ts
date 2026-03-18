import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
}                                     from '@nestjs/common';
import {ConfigService}                from '@nestjs/config';
import {e}                            from '../../../application';
import {TOrganizationSelect}          from '../../orm/drizzle/drizzle-postgres/schema';
import {ISessionStore}                from '../../session_store/interface.session_store.service';
import {NodeCacheSessionStoreService} from '../../session_store/node_cache.session_store/node_cache.session_store.service';
import NestRequest = e.NestRequest;



@Injectable()
export class SessionMiddlewareService implements NestMiddleware {
	private readonly configService: ConfigService<{
		JWT_SECRET_KEY: string;
	}>;
	private readonly sessionStore: ISessionStore;

	constructor(
		configService: ConfigService,
		sessionStore: NodeCacheSessionStoreService,
	) {
		this.configService = configService;
		this.sessionStore  = sessionStore;
	}

	use(req: NestRequest, res: Response, next: (error?: any) => void): any {
		const {sessionId} = req;

		const session = this.sessionStore.getSession(
			sessionId,
		) as TOrganizationSelect;
		if (!session || !session.organization_id) {
			throw new HttpException('Session not found...', HttpStatus.BAD_REQUEST);
		}

		req.session = session;
		next();
	}
}
