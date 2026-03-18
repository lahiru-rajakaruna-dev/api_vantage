import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
}                       from '@nestjs/common';
import {type ZodSchema} from 'zod';



export default class ZodSchemaValidationPipe implements PipeTransform {
	private readonly schema: ZodSchema;

	constructor(schema: ZodSchema) {
		this.schema = schema;
	}

	transform(value: any, metadata: ArgumentMetadata): any {
		try {
			console.log('VALIDATION_PIPE: ', metadata, value);

			if (metadata.type !== 'body') {
				return value;
			}

			return this.schema.parse(value);
		} catch (e) {
			throw new BadRequestException((e as Error).message);
		}
	}
}
