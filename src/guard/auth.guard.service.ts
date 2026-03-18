import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
}                            from '@nestjs/common';
import {OrganizationService} from '../business_logic/organization/organization.service';



@Injectable()
export class AuthGuardService implements CanActivate {
	private readonly organizationService: OrganizationService;

	constructor(organizationService: OrganizationService) {
		this.organizationService = organizationService;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const user_id = request['cookies']['user_id'];

		if (!user_id) {
			throw new UnauthorizedException('Authentication required');
		}

		const organization =
				  await this.organizationService.getOrganizationDetailsByAdmin(user_id);

		if (!organization) {
			throw new UnauthorizedException('Organization not found');
		}

		request.user_id      = user_id;
		request.organization = organization;
		return true;
	}
}
