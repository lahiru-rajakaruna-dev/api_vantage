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



export const employeesAttendances = pgTable(
	'employees_attendances',
	{
		employee_attendance_id                : text().unique().notNull(),
		employee_attendance_employee_id       : text().notNull(),
		employee_attendance_organization_id   : text().notNull(),
		employee_attendance_year              : integer().notNull(),
		employee_attendance_month             : integer().notNull(),
		employee_attendance_total_reported    : integer().notNull().default(0),
		employee_attendance_total_non_reported: integer().notNull().default(0),
		employee_attendance_total_half_days   : integer().notNull().default(0),
		employee_attendance_total_day_offs    : integer().notNull().default(0),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employees_attendances_pk',
												columns: [
													table.employee_attendance_id,
													table.employee_attendance_organization_id,
													table.employee_attendance_employee_id,
												],
											}),
			employeeFk         : foreignKey({
												name          : 'employees_attendances_employee_fk',
												columns       : [
													table.employee_attendance_employee_id,
													table.employee_attendance_organization_id,
												],
												foreignColumns: [
													employees.employee_id,
													employees.employee_organization_id,
												],
											}),
			organizationFk     : foreignKey({
												name          : 'employees_attendances_organization_fk',
												columns       : [table.employee_attendance_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			employeeIdIndex    : index('employee_attendance_employee_id_idx').on(
				table.employee_attendance_employee_id,
			),
			organizationIdIndex: index('employee_attendance_organization_id_idx').on(
				table.employee_attendance_organization_id,
			),
		};
	},
);

export const SchemaEmployeeAttendanceInsert =
				 createInsertSchema(employeesAttendances);
export const SchemaEmployeeAttendanceData   = SchemaEmployeeAttendanceInsert.omit(
	{
		employee_attendance_id             : true,
		employee_attendance_employee_id    : true,
		employee_attendance_organization_id: true,
	},
);
export const SchemaEmployeeAttendanceUpdate = createUpdateSchema(
	employeesAttendances,
).omit({
		   employee_attendance_id             : true,
		   employee_attendance_employee_id    : true,
		   employee_attendance_organization_id: true,
	   });
export const SchemaEmployeeAttendanceSelect =
				 createSelectSchema(employeesAttendances);

export type TEmployeeAttendanceInsert = z.infer<
	typeof SchemaEmployeeAttendanceInsert
>;
export type TEmployeeAttendanceData = z.infer<
	typeof SchemaEmployeeAttendanceData
>;
export type TEmployeeAttendanceUpdate = z.infer<
	typeof SchemaEmployeeAttendanceUpdate
>;
export type TEmployeeAttendanceSelect = z.infer<
	typeof SchemaEmployeeAttendanceSelect
>;

export const employeesAttendancesRelations = relations(
	employeesAttendances,
	({one}) => {
		return {
			employee    : one(employees, {
				fields    : [
					employeesAttendances.employee_attendance_employee_id,
					employeesAttendances.employee_attendance_organization_id,
				],
				references: [employees.employee_id, employees.employee_organization_id],
			}),
			organization: one(organizations, {
				fields    : [employeesAttendances.employee_attendance_organization_id],
				references: [organizations.organization_id],
			}),
		};
	},
);
