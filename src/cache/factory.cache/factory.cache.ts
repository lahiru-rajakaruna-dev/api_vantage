import {ConfigService}    from '@nestjs/config';
import {ModuleRef}        from '@nestjs/core';
import {ICacheService}    from '../interface.cache';
import {NodeCacheService} from '../node.cache/node.cache.service';



export const TOKEN__CACHE_FACTORY = 'TOKEN__CACHE_FACTORY';

export const cacheFactory = {
	provide: TOKEN__CACHE_FACTORY,
	inject : [ConfigService, ModuleRef],
	useFactory(
		configService: ConfigService,
		moduleRef: ModuleRef,
	): ICacheService {
		const cacheDriverOption = configService.get('CACHE_DRIVER');

		switch (cacheDriverOption) {
			case 'NODE_CACHE':
				return moduleRef.get(NodeCacheService);
			default:
				throw new CacheFactoryException('Invalid cache driver options');
		}
	},
};



class CacheFactoryException extends Error {
	constructor(message: string) {
		super(message);
	}
}
