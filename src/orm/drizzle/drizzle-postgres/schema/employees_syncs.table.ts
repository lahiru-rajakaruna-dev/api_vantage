import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
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



export const employeesSyncs = pgTable(
	'employees_syncs',
	{
		employee_sync_id                   : text().notNull().unique(),
		employee_sync_organization_id      : text().notNull(),
		employee_sync_employee_id          : text().notNull(),
		employee_sync_last_synced_timestamp: integer().notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employees_syncs_pk',
												columns: [
													table.employee_sync_id,
													table.employee_sync_organization_id,
													table.employee_sync_employee_id,
												],
											}),
			organizationFk     : foreignKey({
												name          : 'employees_syncs_organization_fk',
												columns       : [table.employee_sync_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			employeeFk         : foreignKey({
												name          : 'employees_syncs_fk',
												columns       : [
													table.employee_sync_employee_id,
													table.employee_sync_organization_id,
												],
												foreignColumns: [
													employees.employee_id,
													employees.employee_organization_id,
												],
											}),
			organizationIdIndex: index('employee_sync_organization_id_idx').on(
				table.employee_sync_organization_id,
			),
			employeeIdIndex    : index('employee_sync_employee_id_idx').on(
				table.employee_sync_employee_id,
			),
		};
	},
);

export const SchemaEmployeeSyncInsert = createInsertSchema(employeesSyncs);
export const SchemaEmployeeSyncData   = SchemaEmployeeSyncInsert.omit({
																		  employee_sync_id             : true,
																		  employee_sync_organization_id: true,
																		  employee_sync_employee_id    : true,
																	  });
export const SchemaEmployeeSyncUpdate = createUpdateSchema(employeesSyncs).omit(
	{
		employee_sync_id             : true,
		employee_sync_organization_id: true,
		employee_sync_employee_id    : true,
	},
);
export const SchemaEmployeeSyncSelect = createSelectSchema(employeesSyncs);

export type TEmployeeSyncInsert = z.infer<typeof SchemaEmployeeSyncInsert>;
export type TEmployeeSyncData = z.infer<typeof SchemaEmployeeSyncData>;
export type TEmployeeSyncUpdate = z.infer<typeof SchemaEmployeeSyncUpdate>;
export type TEmployeeSyncSelect = z.infer<typeof SchemaEmployeeSyncSelect>;

export const EmployeeSyncsRelations = relations(employeesSyncs, ({one}) => {
	return {
		organization: one(organizations, {
			fields    : [employeesSyncs.employee_sync_organization_id],
			references: [organizations.organization_id],
		}),
		employee    : one(employees, {
			fields    : [employeesSyncs.employee_sync_employee_id],
			references: [employees.employee_id],
		}),
	};
});
