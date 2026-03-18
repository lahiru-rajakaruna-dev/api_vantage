import {relations}       from 'drizzle-orm';
import {
	decimal,
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
}                        from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
}                        from 'drizzle-zod';
import {z}               from 'zod';
import {EPGActivityType} from './common';
import {employees}       from './employees.table';
import {organizations}   from './organizations.table';



export const employeesActivities = pgTable(
	'employees_activities',
	{
		employee_activity_id             : text().unique().notNull(),
		employee_activity_employee_id    : text().notNull(),
		employee_activity_organization_id: text().notNull(),
		employee_activity_type           : EPGActivityType().notNull(),
		employee_activity_timestamp      : integer()
			.notNull()
			.$defaultFn(() => Math.floor(Date.now() / 1000)),
		employee_activity_message        : text().notNull(),
		employee_activity_latitude       : decimal({
													   mode     : 'number',
													   precision: 10,
													   scale    : 8,
												   }),
		employee_activity_longitude      : decimal({
													   mode     : 'number',
													   precision: 11,
													   scale    : 8,
												   }),
		employee_activity_ip_address     : text(),
		employee_activity_status         : text({
													enum: ['ACTIVE', 'ARCHIVED', 'DELETED'],
												})
			.default('ACTIVE')
			.notNull(),
		employee_activity_created_at     : integer()
			.notNull()
			.$defaultFn(() => Math.floor(Date.now() / 1000)),
		employee_activity_updated_at     : integer()
			.notNull()
			.$defaultFn(() => Math.floor(Date.now() / 1000)),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employees_activities_pk',
												columns: [table.employee_activity_id],
											}),
			employeeFk         : foreignKey({
												name          : 'employees_activities_employee_fk',
												columns       : [
													table.employee_activity_employee_id,
													table.employee_activity_organization_id,
												],
												foreignColumns: [
													employees.employee_id,
													employees.employee_organization_id,
												],
											}),
			organizationFk     : foreignKey({
												name          : 'employees_activities_organization_fk',
												columns       : [table.employee_activity_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			employeeIdIndex    : index('employee_activity_employee_id_idx').on(
				table.employee_activity_employee_id,
			),
			organizationIdIndex: index('employee_activity_organization_id_idx').on(
				table.employee_activity_organization_id,
			),
			activityTypeIndex  : index('employee_activity_type_idx').on(
				table.employee_activity_type,
			),
			timestampIndex     : index('employee_activity_timestamp_idx').on(
				table.employee_activity_timestamp,
			),
			compositeIndex     : index('employee_activity_employee_timestamp_idx').on(
				table.employee_activity_employee_id,
				table.employee_activity_timestamp,
			),
		};
	},
);

export const SchemaEmployeeActivityInsert = createInsertSchema(
	employeesActivities,
).extend({
			 employee_activity_timestamp : z.number().int().positive(),
			 employee_activity_message   : z.string().min(1).max(500),
			 employee_activity_latitude  : z.number().min(-90).max(90).optional(),
			 employee_activity_longitude : z.number().min(-180).max(180).optional(),
			 employee_activity_ip_address: z.ipv4().optional(),
		 });

export const SchemaEmployeeActivityData = SchemaEmployeeActivityInsert.omit({
																				employee_activity_id             : true,
																				employee_activity_employee_id    : true,
																				employee_activity_organization_id: true,
																				employee_activity_created_at     : true,
																				employee_activity_updated_at     : true,
																				employee_activity_status         : true,
																			});

export const SchemaEmployeeActivityUpdate = createUpdateSchema(
	employeesActivities,
)
	.extend({
				employee_activity_timestamp : z.number().int().positive().optional(),
				employee_activity_message   : z.string().min(1).max(500).optional(),
				employee_activity_latitude  : z.number().min(-90).max(90).optional(),
				employee_activity_longitude : z.number().min(-180).max(180).optional(),
				employee_activity_ip_address: z.ipv4().optional(),
			})
	.omit({
			  employee_activity_id             : true,
			  employee_activity_employee_id    : true,
			  employee_activity_organization_id: true,
			  employee_activity_created_at     : true,
		  });

export const SchemaEmployeeActivitySelect = createSelectSchema(
	employeesActivities,
).extend({
			 employee_activity_timestamp: z.number().int(),
			 employee_activity_message  : z.string(),
			 employee_activity_latitude : z.number().optional().nullable(),
			 employee_activity_longitude: z.number().optional().nullable(),
		 });

export type TEmployeeActivityInsert = z.infer<
	typeof SchemaEmployeeActivityInsert
>;
export type TEmployeeActivityData = z.infer<typeof SchemaEmployeeActivityData>;
export type TEmployeeActivityUpdate = z.infer<
	typeof SchemaEmployeeActivityUpdate
>;
export type TEmployeeActivitySelect = z.infer<
	typeof SchemaEmployeeActivitySelect
>;

export const employeesActivitiesRelations = relations(
	employeesActivities,
	({one}) => {
		return {
			employee    : one(employees, {
				fields    : [
					employeesActivities.employee_activity_employee_id,
					employeesActivities.employee_activity_organization_id,
				],
				references: [employees.employee_id, employees.employee_organization_id],
			}),
			organization: one(organizations, {
				fields    : [employeesActivities.employee_activity_organization_id],
				references: [organizations.organization_id],
			}),
		};
	},
);
