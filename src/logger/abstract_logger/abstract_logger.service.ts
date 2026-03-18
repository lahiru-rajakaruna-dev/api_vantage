import {type ILogTransporter} from '../log_transporter.interface';
import ILoggerService         from '../logger.interface';



export abstract class AbstractLoggerService implements ILoggerService {
	private logTransporter: ILogTransporter;

	constructor(logTransporter: ILogTransporter) {
		this.logTransporter = logTransporter;
	}

	log(message: any) {
		this.logTransporter.log(message);
	}

	logAndReturn<T>(buffer: T, message?: string): T {
		this.logTransporter.log({
									message: message ?? '',
									data   : buffer,
								});

		return buffer;
	}
}
