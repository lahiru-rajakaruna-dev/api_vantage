import {Module}        from '@nestjs/common';
import {DrizzleModule} from './drizzle/drizzle.module';
import {
	OrmFactory,
	TOKEN__ORM_FACTORY,
}                      from './orm-factory/orm-factory.service';
import {ConfigModule}  from '@nestjs/config';



@Module({
			imports  : [DrizzleModule, ConfigModule],
			providers: [OrmFactory],
			exports  : [TOKEN__ORM_FACTORY],
		})
export class OrmModule {
}
