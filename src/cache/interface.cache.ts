export interface ICacheService {
	getDriver(): ICacheDriver;

	getItem(key: string): unknown;

	setItem(key: string, buffer: string | number | Record<string, any>): unknown;
}



export interface ICacheDriver {
	get(key: string): unknown;

	set(key, buffer: string | number | Record<string, any>): unknown;

	del(key: string): unknown;
}
