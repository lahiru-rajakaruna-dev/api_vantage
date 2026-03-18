import {Module}           from '@nestjs/common';
import {ConfigModule}     from '@nestjs/config';
import {LoggerModule}     from '../logger/logger.module';
import {
	cacheFactory,
	TOKEN__CACHE_FACTORY,
}                         from './factory.cache/factory.cache';
import {NodeCacheService} from './node.cache/node.cache.service';



@Module({
			imports  : [LoggerModule, ConfigModule],
			providers: [NodeCacheService, cacheFactory],
			exports  : [TOKEN__CACHE_FACTORY],
		})
export class CacheModule {
}
