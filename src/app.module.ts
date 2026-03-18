import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
	RequestMethod,
}                                  from '@nestjs/common';
import {ConfigModule}              from '@nestjs/config';
import {AppController}             from './app.controller';
import {AppService}                from './app.service';
import {AuthenticationModule}      from './authentication/authentication.module';
import {ClientModule}              from './business_logic/client/client.module';
import {ClientPaymentModule}       from './business_logic/client_payment/client_payment.module';
import {EmployeeModule}            from './business_logic/employee/employee.module';
import {EmployeeAttendanceModule}  from './business_logic/employee_attendance/employee_attendance.module';
import {EmployeeSalaryModule}      from './business_logic/employee_salary/employee_salary.module';
import {EmployeesActivitiesModule} from './business_logic/employees_activities/employees_activities.module';
import {EmployeesSyncsModule}      from './business_logic/employees_syncs/employees_syncs.module';
import {ItemModule}                from './business_logic/item/item.module';
import {OrganizationModule}        from './business_logic/organization/organization.module';
import {OrganizationPaymentModule} from './business_logic/organization_payment/organization-payment.module';
import {SaleModule}                from './business_logic/sale/sale.module';
import {SalesGroupModule}          from './business_logic/sales_group/sales_group.module';
import {CacheModule}               from './cache/cache.module';
import {GuardModule}               from './guard/guard.module';
import {LoggerModule}              from './logger/logger.module';
import {AuthMiddlewareService}     from './middleware/auth/auth.middleware.service';
import {MiddlewareModule}          from './middleware/middleware.module';
import {SessionMiddlewareService}  from './middleware/session/session.middleware.service';
import {DrizzleModule}             from './orm/drizzle/drizzle.module';
import {OrmModule}                 from './orm/orm.module';
import {PaddleModule}              from './paddle/paddle.module';
import {SessionStoreModule}        from './session_store/session_store.module';



@Module({
			imports    : [
				EmployeeModule,
				OrganizationModule,
				OrganizationPaymentModule,
				ClientPaymentModule,
				ItemModule,
				SalesGroupModule,
				ClientModule,
				SaleModule,
				ConfigModule.forRoot({
										 isGlobal   : true,
										 envFilePath: ['.env'],
										 cache      : true,
									 }),
				LoggerModule,
				DrizzleModule,
				OrmModule,
				PaddleModule,
				AuthenticationModule,
				MiddlewareModule,
				EmployeeAttendanceModule,
				GuardModule,
				EmployeesActivitiesModule,
				EmployeesSyncsModule,
				EmployeeSalaryModule,
				CacheModule,
				SessionStoreModule,
			],
			controllers: [AppController],
			providers  : [AppService],
		})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				(req, res, next) => {
					console.debug(req.headers);
					next();
				},
				AuthMiddlewareService,
				SessionMiddlewareService,
			)
			.exclude(
				{
					path  : '/health',
					method: RequestMethod.ALL,
				},
				{
					path  : '/auth/{*wildcard}',
					method: RequestMethod.ALL,
				},
			)
			.forRoutes('*');
	}
}
