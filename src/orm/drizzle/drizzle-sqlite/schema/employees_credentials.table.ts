import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	primaryKey,
	sqliteTable,
	text,
}                      from 'drizzle-orm/sqlite-core';
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const employeesCredentials = sqliteTable(
	'employees_credentials',
	{
		employee_credential_id             : text().notNull(),
		employee_credential_employee_id    : text().notNull(),
		employee_credential_organization_id: text().notNull(),
		employee_credential_username       : text().unique().notNull(),
		employee_credential_password       : text().notNull(),
	},
	(table) => ({
		pk                   : primaryKey({
											  name   : 'employees_credentials_pk',
											  columns: [
												  table.employee_credential_id,
												  table.employee_credential_employee_id,
												  table.employee_credential_organization_id,
											  ],
										  }),
		employeeFk           : foreignKey({
											  name          : 'employees_credentials_employee_fk',
											  columns       : [
												  table.employee_credential_employee_id,
												  table.employee_credential_organization_id,
											  ],
											  foreignColumns: [
												  employees.employee_id,
												  employees.employee_organization_id,
											  ],
										  }),
		organizationFk       : foreignKey({
											  name          : 'employees_credentials_organization_fk',
											  columns       : [table.employee_credential_organization_id],
											  foreignColumns: [organizations.organization_id],
										  }),
		employeeUsernameIndex: index('employee_credential_username_idx').on(
			table.employee_credential_username,
		),
	}),
);

export const employeesCredentialsRelations = relations(
	employeesCredentials,
	({one}) => ({
		employee    : one(employees, {
			fields    : [
				employeesCredentials.employee_credential_employee_id,
				employeesCredentials.employee_credential_organization_id,
			],
			references: [employees.employee_id, employees.employee_organization_id],
		}),
		organization: one(organizations, {
			fields    : [employeesCredentials.employee_credential_organization_id],
			references: [organizations.organization_id],
		}),
	}),
);
