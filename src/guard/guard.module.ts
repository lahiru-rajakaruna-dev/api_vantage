import {Module}             from '@nestjs/common';
import {OrganizationModule} from '../business_logic/organization/organization.module';
import {AuthGuardService}   from './auth.guard.service';



@Module({
			imports  : [OrganizationModule],
			providers: [AuthGuardService],
			exports  : [AuthGuardService],
		})
export class GuardModule {
}
