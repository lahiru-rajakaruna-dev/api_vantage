import {Module}                   from '@nestjs/common';
import {OrganizationModule}       from '../business_logic/organization/organization.module';
import {CacheModule}              from '../cache/cache.module';
import {LoggerModule}             from '../logger/logger.module';
import {SessionStoreModule}       from '../session_store/session_store.module';
import {AuthMiddlewareService}    from './auth/auth.middleware.service';
import {SessionMiddlewareService} from './session/session.middleware.service';



@Module({
			imports  : [OrganizationModule, LoggerModule, CacheModule, SessionStoreModule],
			providers: [AuthMiddlewareService, SessionMiddlewareService],
			exports  : [AuthMiddlewareService, SessionMiddlewareService],
		})
export class MiddlewareModule {
}
