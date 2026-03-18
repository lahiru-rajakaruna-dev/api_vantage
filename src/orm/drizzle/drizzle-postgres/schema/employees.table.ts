import {relations}               from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
}                                from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
}                                from 'drizzle-zod';
import {z}                       from 'zod';
import {employeesActivities}     from './employees_activities';
import {employeesAttendances}    from './employees_attendances.table';
import {employeesCredentials}    from './employees_credentials';
import {employeesSalaryProfiles} from './employees_salaries.table';
import {employeesSyncs}          from './employees_syncs.table';
import {organizations}           from './organizations.table';
import {sales}                   from './sales.table';
import {salesGroups}             from './sales_groups.table';



export const employees = pgTable(
	'employees',
	{
		employee_id                 : text().unique().notNull(),
		employee_organization_id    : text().notNull(),
		employee_sales_group_id     : text(),
		employee_profile_picture_url: text(),
		employee_first_name         : text(),
		employee_last_name          : text(),
		employee_phone              : text(),
		employee_nic_number         : text().notNull().unique(),
		employee_active_territory   : text(),
		employee_registration_date  : integer().notNull(),
		employee_status             : text({
											   enum: ['ON_FIELD', 'ON_LEAVE', 'SUSPENDED', 'FIRED', 'NOT_REPORTED'],
										   })
			.default('NOT_REPORTED')
			.notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employee_primary_key',
												columns: [table.employee_id, table.employee_organization_id],
											}),
			organizationFk     : foreignKey({
												name          : 'employees_organization_fk',
												columns       : [table.employee_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			salesGroupFk       : foreignKey({
												name          : 'employees_sales_group_fk',
												columns       : [table.employee_sales_group_id],
												foreignColumns: [salesGroups.sales_group_id],
											}).onDelete('set null'),
			employeeIdIndex    : index('employee_id_idx').on(table.employee_id),
			organizationIdIndex: index('employee_organization_id_fk_idx').on(
				table.employee_organization_id,
			),
			salesGroupIdIndex  : index('employee_sales_group_id_fk_idx').on(
				table.employee_sales_group_id,
			),
			nicIndex           : index('employee_nic_number_unique_idx').on(
				table.employee_nic_number,
			),
		};
	},
);

export const SchemaEmployeeInsert = createInsertSchema(employees);
export const SchemaEmployeeData   = SchemaEmployeeInsert.omit({
																  employee_id             : true,
																  employee_organization_id: true,
															  });
export const SchemaEmployeeUpdate = createUpdateSchema(employees).omit({
																		   employee_id               : true,
																		   employee_organization_id  : true,
																		   employee_registration_date: true,
																	   });
export const SchemaEmployeeSelect = createSelectSchema(employees);

export type TEmployeeInsert = z.infer<typeof SchemaEmployeeInsert>;
export type TEmployeeData = z.infer<typeof SchemaEmployeeData>;
export type TEmployeeUpdate = z.infer<typeof SchemaEmployeeUpdate>;
export type TEmployeeSelect = z.infer<typeof SchemaEmployeeSelect>;

export const employeesRelations = relations(employees, ({one, many}) => {
	return {
		organization         : one(organizations, {
			fields    : [employees.employee_organization_id],
			references: [organizations.organization_id],
		}),
		employeeCredential   : one(employeesCredentials, {
			fields    : [employees.employee_id, employees.employee_organization_id],
			references: [
				employeesCredentials.employee_credential_employee_id,
				employeesCredentials.employee_credential_organization_id,
			],
		}),
		employeeAttendance   : one(employeesAttendances, {
			fields    : [employees.employee_id, employees.employee_organization_id],
			references: [
				employeesAttendances.employee_attendance_employee_id,
				employeesAttendances.employee_attendance_organization_id,
			],
		}),
		employeeSalaryProfile: one(employeesSalaryProfiles, {
			fields    : [employees.employee_id, employees.employee_organization_id],
			references: [
				employeesSalaryProfiles.employee_salary_profile_employee_id,
				employeesSalaryProfiles.employee_salary_profile_organization_id,
			],
		}),
		employeeSync         : one(employeesSyncs, {
			fields    : [employees.employee_id, employees.employee_organization_id],
			references: [
				employeesSyncs.employee_sync_employee_id,
				employeesSyncs.employee_sync_organization_id,
			],
		}),
		salesGroup           : one(salesGroups, {
			fields    : [
				employees.employee_sales_group_id,
				employees.employee_organization_id,
			],
			references: [
				salesGroups.sales_group_id,
				salesGroups.sales_group_organization_id,
			],
		}),
		sales                : many(sales),
		activities           : many(employeesActivities),
	};
});
