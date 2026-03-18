import {Module}                       from '@nestjs/common';
import {LoggerModule}                 from '../logger/logger.module';
import {NodeCacheSessionStoreService} from './node_cache.session_store/node_cache.session_store.service';



@Module({
			imports  : [LoggerModule],
			providers: [NodeCacheSessionStoreService],
			exports  : [NodeCacheSessionStoreService],
		})
export class SessionStoreModule {
}
