import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	pgTable,
	primaryKey,
	text,
}                      from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
}                      from 'drizzle-zod';
import {z}             from 'zod';
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const employeesCredentials = pgTable(
	'employees_credentials',
	{
		employee_credential_id             : text().unique().notNull(),
		employee_credential_employee_id    : text().notNull(),
		employee_credential_organization_id: text().notNull(),
		employee_credential_username       : text().unique().notNull(),
		employee_credential_password       : text().notNull(),
	},
	(table) => {
		return {
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
			organizationIdIndex  : index('employee_credential_organization_id_idx').on(
				table.employee_credential_organization_id,
			),
			employeeIdIndex      : index('employee_credential_employee_id_idx').on(
				table.employee_credential_employee_id,
			),
			employeeUsernameIndex: index('employee_credential_username_idx').on(
				table.employee_credential_username,
			),
		};
	},
);

export const SchemaEmployeeCredentialsInsert =
				 createInsertSchema(employeesCredentials);
export const SchemaEmployeeCredentialsData   =
				 SchemaEmployeeCredentialsInsert.omit({
														  employee_credential_id             : true,
														  employee_credential_employee_id    : true,
														  employee_credential_organization_id: true,
													  });
export const SchemaEmployeeCredentialsUpdate = createUpdateSchema(
	employeesCredentials,
).omit({
		   employee_credential_id             : true,
		   employee_credential_employee_id    : true,
		   employee_credential_organization_id: true,
	   });
export const SchemaEmployeeCredentialsSelect =
				 createSelectSchema(employeesCredentials);

export type TEmployeeCredentialsInsert = z.infer<
	typeof SchemaEmployeeCredentialsInsert
>;
export type TEmployeeCredentialsData = z.infer<
	typeof SchemaEmployeeCredentialsData
>;
export type TEmployeeCredentialsUpdate = z.infer<
	typeof SchemaEmployeeCredentialsUpdate
>;
export type TEmployeeCredentialsSelect = z.infer<
	typeof SchemaEmployeeCredentialsSelect
>;

export const employeesCredentialsRelations = relations(
	employeesCredentials,
	({one}) => {
		return {
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
		};
	},
);
