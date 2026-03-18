import {createClient}                        from '@libsql/client';
import {Inject, Injectable}                  from '@nestjs/common';
import {ConfigService}                       from '@nestjs/config';
import {and, between, eq, gte, inArray, lte} from 'drizzle-orm';
import {LibSQLDatabase}                      from 'drizzle-orm/libsql';
import {drizzle}                             from 'drizzle-orm/libsql/node';
import {v4 as uuid}                          from 'uuid';
import type ILoggerService                   from '../../../logger/logger.interface';
import {TOKEN__LOGGER_FACTORY}               from '../../../logger/logger_factory/logger_factory.service';
import {EEnvVars}                            from '../../../types';
import AbstractDrizzlerService               from '../abstract_drizzle.service';
import {
	TClientData,
	TClientPaymentData,
	TClientPaymentSelect,
	TClientPaymentUpdate,
	TClientSelect,
	TClientUpdate,
	TEmployeeActivityData,
	TEmployeeActivitySelect,
	TEmployeeAttendanceSelect,
	TEmployeeAttendanceUpdate,
	TEmployeeCredentialsData,
	TEmployeeCredentialsSelect,
	TEmployeeCredentialsUpdate,
	TEmployeeSalaryProfileSelect,
	TEmployeeSalaryProfileUpdate,
	TEmployeeSalaryRecordData,
	TEmployeeSalaryRecordSelect,
	TEmployeeSelect,
	TEmployeeSyncSelect,
	TEmployeeSyncUpdate,
	TEmployeeUpdate,
	TItemData,
	TItemSelect,
	TItemUpdate,
	TOrganizationData,
	TOrganizationPaymentData,
	TOrganizationPaymentSelect,
	TOrganizationPaymentUpdate,
	TOrganizationSelect,
	TOrganizationUpdate,
	TSaleData,
	TSaleSelect,
	TSalesGroupData,
	TSalesGroupSelect,
	TSalesGroupUpdate,
	TSaleUpdate,
}                                            from '../drizzle-postgres/schema';
import * as schema                           from './schema';
import {
	clients,
	clientsPayments,
	employees,
	employeesActivities,
	employeesAttendances,
	employeesCredentials,
	employeesSalaryProfiles,
	employeesSalaryRecords,
	employeesSyncs,
	items,
	organizations,
	organizationsPayments,
	sales,
	salesGroups,
}                                            from './schema';



@Injectable()
export class DrizzleSqliteService extends AbstractDrizzlerService {
	protected readonly driver: LibSQLDatabase<typeof schema>;
	private readonly sqliteClient: ReturnType<typeof createClient>;

	constructor(
		configService: ConfigService,
		@Inject(TOKEN__LOGGER_FACTORY)
		logger: ILoggerService,
	) {
		super(configService, logger);

		this.sqliteClient = createClient({
											 url: this.configService.get(EEnvVars.SQLITE_URL) as string,
										 });

		// sqliteClient.execute('PRAGMA journal_mode = WAL;');

		this.driver = drizzle(this.sqliteClient, {
			schema: schema,
		});
	}

	async addOrganization(
		organization_id: string,
		organization_admin_id: string,
		organization_stripe_customer_id: string,
		organizationDetails: TOrganizationData,
	): Promise<TOrganizationSelect> {
		const result = await this.driver.transaction(async (tx) => {
			return tx
				.insert(organizations)
				.values({
							...organizationDetails,
							organization_id                : organization_id,
							organization_admin_id          : organization_admin_id,
							organization_paddle_customer_id: organization_stripe_customer_id,
						})
				.returning();
		});
		return this.logger.logAndReturn(result[0], 'operation: add_organization');
	}

	async updateOrganizationById(
		organization_id: string,
		organizationUpdates: TOrganizationUpdate,
	): Promise<TOrganizationSelect> {
		const result = await this.driver.transaction(async (tx) => {
			return tx
				.update(organizations)
				.set(organizationUpdates)
				.where(eq(organizations.organization_id, organization_id))
				.returning();
		});
		return this.logger.logAndReturn(
			result[0],
			'operation: update_organization_by_id',
		);
	}

	async getOrganizationDetailsById(
		organization_id: string,
	): Promise<TOrganizationSelect> {
		const result = await this.driver
								 .select()
								 .from(organizations)
								 .where(eq(organizations.organization_id, organization_id));
		return this.logger.logAndReturn(
			result[0],
			'operation: get_organization_details_by_id',
		);
	}

	async getOrganizationDetailsByAdminId(
		admin_id: string,
	): Promise<TOrganizationSelect> {
		const result = await this.driver
								 .select()
								 .from(organizations)
								 .where(eq(organizations.organization_admin_id, admin_id));
		return this.logger.logAndReturn(
			result[0],
			'operation: get_organization_details_by_admin_id',
		);
	}

	async addEmployee(
		organization_id: string,
		employee_id: string,
		currentMonth: number,
		currentYear: number,
		employeeCredentials: TEmployeeCredentialsData,
	): Promise<TEmployeeSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			const employeeRecord = (
				await tx
					.insert(employees)
					.values({
								employee_id                 : employee_id,
								employee_organization_id    : organization_id,
								employee_sales_group_id     : null,
								employee_first_name         : null,
								employee_last_name          : null,
								employee_registration_date  : Date.now(),
								employee_active_territory   : null,
								employee_phone              : null,
								employee_nic_number         :
								employeeCredentials.employee_credential_username,
								employee_profile_picture_url: null,
							})
					.returning()
			)[0];

			await tx.insert(employeesCredentials).values({
															 employee_credential_id             : uuid().toString(),
															 employee_credential_employee_id    : employeeRecord.employee_id,
															 employee_credential_organization_id: organization_id,
															 employee_credential_username       :
															 employeeCredentials.employee_credential_username,
															 employee_credential_password       :
															 employeeCredentials.employee_credential_password,
														 });

			await tx.insert(employeesAttendances).values({
															 employee_attendance_id             : uuid().toString(),
															 employee_attendance_organization_id: organization_id,
															 employee_attendance_employee_id    : employeeRecord.employee_id,
															 employee_attendance_month          : currentMonth,
															 employee_attendance_year           : currentYear,
														 });

			await tx.insert(employeesSalaryProfiles).values({
																employee_salary_profile_id                   : uuid()
																	.toString(),
																employee_salary_profile_organization_id      : organization_id,
																employee_salary_profile_employee_id          : employeeRecord.employee_id,
																employee_salary_profile_base                 : 30_000,
																employee_salary_profile_commission_percentage: 0,
															});

			await tx.insert(employeesSyncs).values({
													   employee_sync_id                   : uuid().toString(),
													   employee_sync_employee_id          : employeeRecord.employee_id,
													   employee_sync_organization_id      : organization_id,
													   employee_sync_last_synced_timestamp: Date.now(),
												   });

			return tx
				.select()
				.from(employees)
				.where(eq(employees.employee_organization_id, organization_id));
		});

		return this.logger.logAndReturn(result, 'operation: add_employee');
	}

	async addEmployeeActivity(
		organization_id: string,
		employee_id: string,
		activity_id: string,
		employeeActivityData: TEmployeeActivityData,
	): Promise<TEmployeeActivitySelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(employeesActivities).values({
															...employeeActivityData,
															employee_activity_organization_id: organization_id,
															employee_activity_employee_id    : employee_id,
															employee_activity_id             : activity_id,
														});

			return tx
				.select()
				.from(employeesActivities)
				.where(
					and(
						eq(
							employeesActivities.employee_activity_organization_id,
							organization_id,
						),
						eq(employeesActivities.employee_activity_employee_id, employee_id),
					),
				);
		});

		return this.logger.logAndReturn(
			result,
			'operation:' + ' add_employee_activity',
		);
	}

	async getEmployeeActivityProfile(
		organization_id: string,
		employee_id: string,
		start_date?: number,
		end_date?: number,
	) {
		const result = await this.driver.query.employeesActivities.findMany({
																				where({
																						  employee_activity_organization_id,
																						  employee_activity_employee_id,
																						  employee_activity_timestamp,
																					  }) {
																					return and(
																						eq(
																							employee_activity_organization_id,
																							organization_id
																						),
																						eq(
																							employee_activity_employee_id,
																							employee_id
																						),
																						start_date ? gte(
																							employee_activity_timestamp,
																							start_date
																						) : undefined,
																						end_date ? lte(
																							employee_activity_timestamp,
																							end_date
																						) : undefined,
																					);
																				},
																			});

		return this.logger.logAndReturn(
			result,
			'operation:' + ' get_employee_activity_profile',
		);
	}

	async getEmployeeProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSelect> {
		const result = await this.driver.transaction(async (tx) => {
			const employee = (
				await tx
					.select()
					.from(employees)
					.where(
						and(
							eq(employees.employee_organization_id, organization_id),
							eq(employees.employee_id, employee_id),
						),
					)
			)[0];

			if (!employee) {
				throw new Error(`No such employee: ${employee_id}`);
			}

			return employee;
		});

		return this.logger.logAndReturn(result, 'operation: view_employee_by_id');
	}

	async getEmployeesByOrganizationId(
		organization_id: string,
	): Promise<TEmployeeSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(employees)
					  .where(eq(employees.employee_organization_id, organization_id)),
			'operation: get_employees_by_organization_id',
		);
	}

	async getEmployeesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TEmployeeSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(employees)
					  .where(
						  and(
							  eq(employees.employee_organization_id, organization_id),
							  eq(employees.employee_sales_group_id, sales_group_id),
						  ),
					  ),
			'operation: get_employees_by_sales_group_id',
		);
	}

	async updateEmployeeById(
		organization_id: string,
		employee_id: string,
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(employees)
				.set(employeeUpdates)
				.where(
					and(
						eq(employees.employee_organization_id, organization_id),
						eq(employees.employee_id, employee_id),
					),
				);
			return tx
				.select()
				.from(employees)
				.where(eq(employees.employee_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_employee_by_id');
	}

	async updateEmployeesByIds(
		organization_id: string,
		employees_ids: string[],
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(employees)
				.set(employeeUpdates)
				.where(
					and(
						eq(employees.employee_organization_id, organization_id),
						inArray(employees.employee_id, employees_ids),
					),
				);
			return tx
				.select()
				.from(employees)
				.where(eq(employees.employee_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_employee_by_id');
	}

	async updateEmployeeCredentials(
		organization_id: string,
		employee_id: string,
		credentialUpdates: TEmployeeCredentialsUpdate,
	): Promise<TEmployeeCredentialsSelect> {
		const result = await this.driver
								 .update(employeesCredentials)
								 .set(credentialUpdates)
								 .where(
									 and(
										 eq(
											 employeesCredentials.employee_credential_organization_id,
											 organization_id,
										 ),
										 eq(employeesCredentials.employee_credential_employee_id, employee_id),
									 ),
								 )
								 .returning();

		return this.logger.logAndReturn(
			result[0],
			'operation: update_employee_credentials',
		);
	}

	async getEmployeeAttendance(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeAttendanceSelect> {
		const result = await this.driver
								 .select()
								 .from(employeesAttendances)
								 .where(
									 and(
										 eq(
											 employeesAttendances.employee_attendance_organization_id,
											 organization_id,
										 ),
										 eq(employeesAttendances.employee_attendance_employee_id, employee_id),
									 ),
								 );

		return this.logger.logAndReturn(
			result[0],
			'operation: update_employee_leave',
		);
	}

	async updateEmployeeAttendance(
		organization_id: string,
		employee_id: string,
		attendance_id: string,
		employeeAttendanceUpdates: TEmployeeAttendanceUpdate,
	): Promise<TEmployeeAttendanceSelect> {
		const result = await this.driver
								 .update(employeesAttendances)
								 .set(employeeAttendanceUpdates)
								 .where(
									 and(
										 eq(
											 employeesAttendances.employee_attendance_organization_id,
											 organization_id,
										 ),
										 eq(employeesAttendances.employee_attendance_id, attendance_id),
										 eq(employeesAttendances.employee_attendance_employee_id, employee_id),
									 ),
								 )
								 .returning();

		return this.logger.logAndReturn(
			result[0],
			'operation: update_employee_leave',
		);
	}

	async getEmployeeSalaryProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSalaryProfileSelect> {
		const result = await this.driver.query.employeesSalaryProfiles.findFirst({
																					 where({
																							   employee_salary_profile_organization_id,
																							   employee_salary_profile_employee_id,
																						   }) {
																						 return and(
																							 eq(
																								 employee_salary_profile_organization_id,
																								 organization_id
																							 ),
																							 eq(
																								 employee_salary_profile_employee_id,
																								 employee_id
																							 ),
																						 );
																					 },
																				 });

		if (!result) {
			throw new Error('No employee salary profile record found');
		}

		return this.logger.logAndReturn(
			result,
			'operation:' + ' get_employee_salary_profile_by_id',
		);
	}

	async updateEmployeeSalaryProfile(
		organization_id: string,
		employee_id: string,
		employeeSalaryProfileUpdates: TEmployeeSalaryProfileUpdate,
	): Promise<TEmployeeSalaryProfileSelect> {
		const result = await this.driver
								 .update(employeesSalaryProfiles)
								 .set(employeeSalaryProfileUpdates)
								 .where(
									 and(
										 eq(
											 employeesSalaryProfiles.employee_salary_profile_organization_id,
											 organization_id,
										 ),
										 eq(
											 employeesSalaryProfiles.employee_salary_profile_employee_id,
											 employee_id,
										 ),
									 ),
								 )
								 .returning();

		return this.logger.logAndReturn(
			result[0],
			'operation: update_employee_salary',
		);
	}

	async getEmployeeSalaryRecords(
		organization_id: string,
		employee_id: string,
		monthStart?: number,
		monthEnd?: number,
	): Promise<TEmployeeSalaryRecordSelect[]> {
		const result = await this.driver.query.employeesSalaryRecords.findMany({
																				   where({
																							 employee_salary_record_organization_id,
																							 employee_salary_record_employee_id,
																							 employee_salary_record_timestamp,
																						 }) {
																					   return and(
																						   eq(
																							   employee_salary_record_organization_id,
																							   organization_id
																						   ),
																						   eq(
																							   employee_salary_record_employee_id,
																							   employee_id
																						   ),
																						   monthEnd
																							   ? lte(
																								   employee_salary_record_timestamp,
																								   monthEnd
																							   )
																							   : undefined,
																						   monthStart
																							   ? gte(
																								   employee_salary_record_timestamp,
																								   monthStart
																							   )
																							   : undefined,
																					   );
																				   },
																			   });

		return this.logger.logAndReturn(
			result,
			'operations:' + ' get_employee_salary_records',
		);
	}

	async addEmployeeSalaryRecord(
		organization_id: string,
		employee_id: string,
		employee_salary_record_id: string,
		salaryRecordData: TEmployeeSalaryRecordData,
	): Promise<TEmployeeSalaryRecordSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(employeesSalaryRecords).values({
															   ...salaryRecordData,
															   employee_salary_record_organization_id: organization_id,
															   employee_salary_record_employee_id    : employee_id,
															   employee_salary_record_id             : employee_salary_record_id,
														   });

			return await tx.query.employeesSalaryRecords.findMany({
																	  where({
																				employee_salary_record_organization_id,
																				employee_salary_record_employee_id,
																			}) {
																		  return and(
																			  eq(
																				  employee_salary_record_organization_id,
																				  organization_id
																			  ),
																			  eq(
																				  employee_salary_record_employee_id,
																				  employee_id
																			  ),
																		  );
																	  },
																  });
		});

		return this.logger.logAndReturn(
			result,
			'operation:' + ' add_employee_salary_record',
		);
	}

	async getEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSyncSelect> {
		const result = await this.driver.query.employeesSyncs.findFirst({
																			where({
																					  employee_sync_organization_id,
																					  employee_sync_employee_id
																				  }) {
																				return and(
																					eq(
																						employee_sync_organization_id,
																						organization_id
																					),
																					eq(
																						employee_sync_employee_id,
																						employee_id
																					),
																				);
																			},
																		});

		if (!result) {
			throw new Error('No employee sync record found');
		}

		return this.logger.logAndReturn(
			result[0],
			'operation:' + ' get_employee_sync_profile_by_id',
		);
	}

	async updateEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
		employeeSyncUpdates: TEmployeeSyncUpdate,
	): Promise<TEmployeeSyncSelect> {
		const result = await this.driver
								 .update(employeesSyncs)
								 .set(employeeSyncUpdates)
								 .where(
									 and(
										 eq(employeesSyncs.employee_sync_organization_id, organization_id),
										 eq(employeesSyncs.employee_sync_employee_id, employee_id),
									 ),
								 )
								 .returning();

		if (!result) {
			throw new Error('No employee sync record found');
		}

		return this.logger.logAndReturn(
			result[0],
			'operation:' + ' get_employee_sync_profile_by_id',
		);
	}

	async getItemById(
		organization_id: string,
		item_id: string,
	): Promise<TItemSelect> {
		const result = await this.driver
								 .select()
								 .from(items)
								 .where(
									 and(
										 eq(items.item_organization_id, organization_id),
										 eq(items.item_id, item_id),
									 ),
								 );

		return this.logger.logAndReturn(result[0], 'operation: view_item_by_id');
	}

	async addItem(
		organization_id: string,
		item_id: string,
		itemDetails: TItemData,
	): Promise<TItemSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(items).values({
											  ...itemDetails,
											  item_organization_id: organization_id,
											  item_id             : item_id,
										  });
			return tx
				.select()
				.from(items)
				.where(eq(items.item_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: add_item');
	}

	async getItemsByOrganizationId(
		organization_id: string,
	): Promise<TItemSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(items)
					  .where(eq(items.item_organization_id, organization_id)),
			'operation: get_items_by_organization_id',
		);
	}

	async updateItemById(
		organization_id: string,
		item_id: string,
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(items)
				.set(itemUpdates)
				.where(
					and(
						eq(items.item_organization_id, organization_id),
						eq(items.item_id, item_id),
					),
				);
			return tx
				.select()
				.from(items)
				.where(eq(items.item_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_item_by_id');
	}

	async updateItemsByIds(
		organization_id: string,
		items_ids: string[],
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(items)
				.set(itemUpdates)
				.where(
					and(
						eq(items.item_organization_id, organization_id),
						inArray(items.item_id, items_ids),
					),
				);
			return tx
				.select()
				.from(items)
				.where(eq(items.item_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_item_by_id');
	}

	async addSalesGroup(
		organization_id: string,
		sales_group_id: string,
		salesGroupDetails: TSalesGroupData,
	): Promise<TSalesGroupSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(salesGroups).values({
													...salesGroupDetails,
													sales_group_organization_id: organization_id,
													sales_group_id             : sales_group_id,
												});
			return tx
				.select()
				.from(salesGroups)
				.where(eq(salesGroups.sales_group_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: add_sales_group');
	}

	async getSalesGroupsByOrganizationId(
		organization_id: string,
	): Promise<TSalesGroupSelect[]> {
		const result = await this.driver.query.salesGroups.findMany({
																		where(salesGroup) {
																			return eq(
																				salesGroup.sales_group_organization_id,
																				organization_id
																			);
																		},
																	});
		return this.logger.logAndReturn(
			result,
			'operation: get_sales_groups_by_organization_id',
		);
	}

	async getSalesGroupDetailsById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect> {
		const result = await this.driver.query.salesGroups.findFirst({
																		 where(salesGroup) {
																			 return and(
																				 eq(
																					 salesGroup.sales_group_organization_id,
																					 organization_id
																				 ),
																				 eq(
																					 salesGroup.sales_group_id,
																					 sales_group_id
																				 ),
																			 );
																		 },
																		 with: {
																			 employees: {
																				 with: {
																					 sales: true,
																				 },
																			 },
																		 },
																	 });

		if (!result) {
			throw new Error('No sales group found');
		}

		return this.logger.logAndReturn(
			result,
			'operation: get_sales_group_details_by_id',
		);
	}

	async updateSalesGroupById(
		organization_id: string,
		sales_group_id: string,
		salesGroupUpdates: TSalesGroupUpdate,
	): Promise<TSalesGroupSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(salesGroups)
				.set(salesGroupUpdates)
				.where(
					and(
						eq(salesGroups.sales_group_organization_id, organization_id),
						eq(salesGroups.sales_group_id, sales_group_id),
					),
				);
			return tx
				.select()
				.from(salesGroups)
				.where(eq(salesGroups.sales_group_organization_id, organization_id));
		});
		return this.logger.logAndReturn(
			result,
			'operation: update_sales_group_by_id',
		);
	}

	async deleteSalesGroupById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.delete(salesGroups)
				.where(
					and(
						eq(salesGroups.sales_group_organization_id, organization_id),
						eq(salesGroups.sales_group_id, sales_group_id),
					),
				);
			return tx
				.select()
				.from(salesGroups)
				.where(eq(salesGroups.sales_group_organization_id, organization_id));
		});
		return this.logger.logAndReturn(
			result,
			'operation: delete_sales_group_by_id',
		);
	}

	async addClient(
		organization_id: string,
		client_id: string,
		clientDetails: TClientData,
	): Promise<TClientSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(clients).values({
												...clientDetails,
												client_organization_id: organization_id,
												client_id             : client_id, // Added
												// missing
												// organization_id
											});
			return tx
				.select()
				.from(clients)
				.where(eq(clients.client_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: add_client');
	}

	async getClientProfileById(
		organization_id: string,
		client_id: string,
	): Promise<TClientSelect> {
		const result = await this.driver
								 .select()
								 .from(clients)
								 .where(
									 and(
										 eq(clients.client_organization_id, organization_id),
										 eq(clients.client_id, client_id),
									 ),
								 )
								 .limit(1);
		return this.logger.logAndReturn(
			result[0],
			'operation: get_client_profile_by_id',
		);
	}

	async getClientsByOrganizationId(
		organization_id: string,
	): Promise<TClientSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(clients)
					  .where(eq(clients.client_organization_id, organization_id)),
			'operation: get_clients_by_organization_id',
		);
	}

	async updateClientById(
		organization_id: string,
		client_id: string,
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(clients)
				.set(clientUpdates)
				.where(
					and(
						eq(clients.client_organization_id, organization_id),
						eq(clients.client_id, client_id),
					),
				);
			return tx
				.select()
				.from(clients)
				.where(eq(clients.client_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_client_by_id');
	}

	async updateClientsByIds(
		organization_id: string,
		clients_ids: string[],
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(clients)
				.set(clientUpdates)
				.where(
					and(
						eq(clients.client_organization_id, organization_id),
						inArray(clients.client_id, clients_ids),
					),
				);
			return tx
				.select()
				.from(clients)
				.where(eq(clients.client_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: update_client_by_id');
	}

	async addOrganizationPayment(
		organization_id: string,
		organization_payment_id: string,
		paymentDetails: TOrganizationPaymentData,
	): Promise<TOrganizationPaymentSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(organizationsPayments).values({
															  ...paymentDetails,
															  organization_payment_organization_id: organization_id,
															  organization_payment_id             : organization_payment_id, // Added missing organization_id
														  });
			return tx
				.select()
				.from(organizationsPayments)
				.where(
					eq(
						organizationsPayments.organization_payment_organization_id,
						organization_id,
					),
				);
		});
		return this.logger.logAndReturn(
			result,
			'operation: add_organization_payment',
		);
	}

	async getOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TOrganizationPaymentSelect> {
		return this.logger.logAndReturn(
			(
				await this.driver
						  .select()
						  .from(organizationsPayments)
						  .where(
							  and(
								  eq(
									  organizationsPayments.organization_payment_organization_id,
									  organization_id,
								  ),
								  eq(organizationsPayments.organization_payment_id, payment_id),
							  ),
						  )
			)[0],
			'operation: get_organization_payment_by_id', // Fixed log message
		);
	}

	async getOrganizationPaymentsByOrganizationId(
		organization_id: string,
	): Promise<TOrganizationPaymentSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(organizationsPayments)
					  .where(
						  eq(
							  organizationsPayments.organization_payment_organization_id,
							  organization_id,
						  ),
					  ),
			'operation: get_organization_payments_by_organization_id',
		);
	}

	async updateOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
		paymentUpdates: TOrganizationPaymentUpdate,
	): Promise<TOrganizationPaymentSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(organizationsPayments)
				.set(paymentUpdates)
				.where(
					and(
						eq(
							organizationsPayments.organization_payment_organization_id,
							organization_id,
						),
						eq(organizationsPayments.organization_payment_id, payment_id),
					),
				);
			return tx
				.select()
				.from(organizationsPayments)
				.where(
					eq(
						organizationsPayments.organization_payment_organization_id,
						organization_id,
					),
				);
		});
		return this.logger.logAndReturn(
			result,
			'operation: update_organization_payment_by_id',
		);
	}

	async addClientPayment(
		organization_id: string,
		client_id: string,
		client_payment_id: string,
		paymentDetails: TClientPaymentData,
	): Promise<TClientPaymentSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(clientsPayments).values({
														...paymentDetails,
														client_payment_organization_id: organization_id,
														client_payment_client_id      : client_id,
														client_payment_id             : client_payment_id,
													});
			return tx
				.select()
				.from(clientsPayments)
				.where(
					and(
						eq(clientsPayments.client_payment_organization_id, organization_id),
						eq(clientsPayments.client_payment_client_id, client_id),
					),
				);
		});
		return this.logger.logAndReturn(result, 'operation: add_client_payment');
	}

	async getClientPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TClientPaymentSelect> {
		const result = await this.driver
								 .select()
								 .from(clientsPayments)
								 .where(
									 and(
										 eq(clientsPayments.client_payment_organization_id, organization_id),
										 eq(clientsPayments.client_payment_id, payment_id),
									 ),
								 )
								 .limit(1);
		return this.logger.logAndReturn(
			result[0],
			'operation: get_client_payment_by_id',
		);
	}

	async getClientPaymentsByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TClientPaymentSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(clientsPayments)
					  .where(
						  and(
							  eq(clientsPayments.client_payment_organization_id, organization_id),
							  eq(clientsPayments.client_payment_client_id, client_id),
						  ),
					  ),
			'operation: get_client_payments_by_client_id',
		);
	}

	async updateClientPaymentById(
		organization_id: string,
		payment_id: string,
		clientPaymentUpdates: TClientPaymentUpdate,
	): Promise<TClientPaymentSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(clientsPayments)
				.set(clientPaymentUpdates)
				.where(
					and(
						eq(clientsPayments.client_payment_organization_id, organization_id),
						eq(clientsPayments.client_payment_id, payment_id),
					),
				);
			return tx
				.select()
				.from(clientsPayments)
				.where(
					eq(clientsPayments.client_payment_organization_id, organization_id),
				);
		});
		return this.logger.logAndReturn(
			result,
			'operation: update_client_payment_by_id',
		);
	}

	async addSale(
		organization_id: string,
		employee_id: string,
		sale_id: string,
		saleDetails: TSaleData,
	): Promise<TSaleSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx.insert(sales).values({
											  ...saleDetails,
											  sale_organization_id: organization_id,
											  sale_employee_id    : employee_id,
											  sale_id             : sale_id,
										  });
			return tx
				.select()
				.from(sales)
				.where(eq(sales.sale_organization_id, organization_id));
		});
		return this.logger.logAndReturn(result, 'operation: add_sale_item');
	}

	async getSaleById(
		organization_id: string,
		sale_id: string,
	): Promise<TSaleSelect> {
		const result = await this.driver
								 .select()
								 .from(sales)
								 .where(
									 and(
										 eq(sales.sale_organization_id, organization_id),
										 eq(sales.sale_id, sale_id),
									 ),
								 );
		return this.logger.logAndReturn(result[0], 'operation: view_sale_by_id');
	}

	async getSalesByEmployeeId(
		organization_id: string,
		employee_id: string,
	): Promise<TSaleSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(sales)
					  .where(
						  and(
							  eq(sales.sale_organization_id, organization_id),
							  eq(sales.sale_employee_id, employee_id),
						  ),
					  ),
			'operation: get_sales_by_employee_id',
		);
	}

	async getSalesByItemId(
		organization_id: string,
		item_id: string,
	): Promise<TSaleSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(sales)
					  .where(
						  and(
							  eq(sales.sale_organization_id, organization_id),
							  eq(sales.sale_item_id, item_id),
						  ),
					  ),
			'operation: get_sales_by_item_id',
		);
	}

	async getSalesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSaleSelect[]> {
		const result = await this.driver.query.employees.findMany({
																	  where  : (employees, operators) => {
																		  return and(
																			  eq(
																				  employees.employee_organization_id,
																				  organization_id
																			  ),
																			  eq(
																				  employees.employee_sales_group_id,
																				  sales_group_id
																			  ),
																		  );
																	  },
																	  columns: {employee_id: true},
																	  with   : {
																		  sales: {
																			  where: (sales) => {
																				  return eq(
																					  sales.sale_organization_id,
																					  organization_id
																				  );
																			  },
																		  },
																	  },
																  });

		const allSales = result.reduce((allSalesArray, currentEmployee) => {
			return [...allSalesArray, ...currentEmployee.sales];
		}, [] as TSaleSelect[]);

		return this.logger.logAndReturn(
			allSales,
			'operation:' + ' get_sales_by_sales_group_id',
		);
	}

	async getSalesByOrganizationId(
		organization_id: string,
	): Promise<TSaleSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(sales)
					  .where(eq(sales.sale_organization_id, organization_id)),
			'operation: get_sales_by_organization_id',
		);
	}

	async getSalesByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TSaleSelect[]> {
		return this.logger.logAndReturn(
			await this.driver
					  .select()
					  .from(sales)
					  .where(
						  and(
							  eq(sales.sale_organization_id, organization_id),
							  eq(sales.sale_client_id, client_id),
						  ),
					  ),
			'operation: get_sales_by_client_id',
		);
	}

	async getSalesByDate(
		organization_id: string,
		date: number,
	): Promise<TSaleSelect[]> {
		const result = await this.driver
								 .select()
								 .from(sales)
								 .where(
									 and(
										 eq(sales.sale_organization_id, organization_id),
										 eq(sales.sale_date, date),
									 ),
								 );
		return this.logger.logAndReturn(result, 'operation: get_sales_by_date');
	}

	async getSalesWithinDates(
		organization_id: string,
		date_start: number,
		date_end: number,
	): Promise<TSaleSelect[]> {
		const result = await this.driver
								 .select()
								 .from(sales)
								 .where(
									 and(
										 eq(sales.sale_organization_id, organization_id),
										 between(sales.sale_date, date_start, date_end),
									 ),
								 );
		return this.logger.logAndReturn(
			result,
			'operation: get_sales_within_dates',
		);
	}

	async updateSaleById(
		organization_id: string,
		sale_id: string,
		saleUpdates: TSaleUpdate,
	): Promise<TSaleSelect[]> {
		const result = await this.driver.transaction(async (tx) => {
			await tx
				.update(sales)
				.set(saleUpdates)
				.where(
					and(
						eq(sales.sale_organization_id, organization_id),
						eq(sales.sale_id, sale_id),
					),
				);

			return await tx
				.select()
				.from(sales)
				.where(eq(sales.sale_organization_id, organization_id));
		});

		return this.logger.logAndReturn(result, 'operation: update_sale_by_id');
	}
}
