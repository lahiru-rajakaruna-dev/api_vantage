import {Inject, Injectable}      from '@nestjs/common';
import NodeCache                 from 'node-cache';
import {ICacheDriver}            from '../../cache/interface.cache';
import type ILoggerService       from '../../logger/logger.interface';
import {TOKEN__LOGGER_FACTORY}   from '../../logger/logger_factory/logger_factory.service';
import {TOrganizationSelect}     from '../../orm/drizzle/drizzle-postgres/schema';
import {BaseSessionStoreService} from '../base.session_store/base.session_store.service';



@Injectable()
export class NodeCacheSessionStoreService extends BaseSessionStoreService {
	private readonly nodeCacheDriver: NodeCache;

	constructor(@Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService) {
		super(logger);
		this.nodeCacheDriver = new NodeCache({
												 stdTTL        : 60 * 60 * 24,
												 checkperiod   : 60 * 60 * 24,
												 useClones     : false,
												 deleteOnExpire: true,
											 });
	}

	getDriver(): ICacheDriver {
		return this.nodeCacheDriver;
	}

	deleteSession(id: string): boolean | undefined {
		return super.deleteSession(id);
	}

	getSession(id: string): TOrganizationSelect | undefined {
		return super.getSession(id);
	}

	setSession(id: string, buffer: TOrganizationSelect): boolean | undefined {
		return super.setSession(id, buffer);
	}
}
