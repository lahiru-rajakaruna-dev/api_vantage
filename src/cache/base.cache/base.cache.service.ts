import type ILoggerService           from '../../logger/logger.interface';
import {ICacheDriver, ICacheService} from '../interface.cache';



export abstract class BaseCacheService implements ICacheService {
	private readonly logger: ILoggerService;

	constructor(logger: ILoggerService) {
		this.logger = logger;
	}

	abstract getDriver(): ICacheDriver;

	getItem(key: string): unknown {
		return this.getDriver().get(key);
	}

	setItem(key: string, buffer: string | number | Record<string, any>): unknown {
		return this.getDriver().set(key, buffer);
	}
}
