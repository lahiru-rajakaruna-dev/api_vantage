import {Inject, Injectable}    from '@nestjs/common';
import NodeCache               from 'node-cache';
import type ILoggerService     from '../../logger/logger.interface';
import {TOKEN__LOGGER_FACTORY} from '../../logger/logger_factory/logger_factory.service';
import {BaseCacheService}      from '../base.cache/base.cache.service';
import {ICacheDriver}          from '../interface.cache';



@Injectable()
export class NodeCacheService extends BaseCacheService {
	private readonly nodeCacheDriver: NodeCache;

	constructor(@Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService) {
		super(logger);
		this.nodeCacheDriver = new NodeCache({
												 stdTTL        : 60,
												 useClones     : false,
												 checkperiod   : 60,
												 deleteOnExpire: true,
											 });
	}

	getDriver(): ICacheDriver {
		console.log(this);
		return this.nodeCacheDriver;
	}
}
