import {ICacheDriver}        from '../cache/interface.cache';
import {TOrganizationSelect} from '../orm/drizzle/drizzle-postgres/schema';



export interface ISessionStore {
	getDriver(): ICacheDriver;

	getSession(id: string): TOrganizationSelect | undefined;

	setSession(id: string, buffer: TOrganizationSelect): boolean | undefined;

	deleteSession(id: string): boolean | undefined;
}
