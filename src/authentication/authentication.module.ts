import {Module}                   from '@nestjs/common';
import {ConfigModule}             from '@nestjs/config';
import {OrganizationModule}       from '../business_logic/organization/organization.module';
import {LoggerModule}             from '../logger/logger.module';
import {SessionStoreModule}       from '../session_store/session_store.module';
import {AuthenticationController} from './authentication.controller';
import {AuthenticationService}    from './authentication.service';



@Module({
			imports    : [ConfigModule, OrganizationModule, LoggerModule, SessionStoreModule],
			controllers: [AuthenticationController],
			providers  : [AuthenticationService],
		})
export class AuthenticationModule {
}
