import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
}                      from 'drizzle-orm/sqlite-core';
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const employeesActivities = sqliteTable(
	'employees_activities',
	{
		employee_activity_id             : text().unique().notNull(),
		employee_activity_employee_id    : text().notNull(),
		employee_activity_organization_id: text().notNull(),
		employee_activity_type           : text({
													enum: [
														'SALE_INITIALIZED',
														'SALE_CLOSED',
														'SALE_PROSPECTED',
														'DAY_OFF_REQUESTED',
														'REPORTED',
														'DATA_SYNCED',
														'LOGGED_OFF',
														'LOGGED_IN',
														'PAYMENT_ADDED',
														'CLIENT_ADDED',
														'CLIENT_UPDATED',
														'ITEM_ADDED',
														'ITEM_UPDATED',
														'CHECK_IN',
														'CHECK_OUT',
														'BREAK_STARTED',
														'BREAK_ENDED',
														'TRAVEL_STARTED',
														'TRAVEL_ENDED',
														'MEETING_ATTENDED',
														'TASK_COMPLETED',
														'REPORT_SUBMITTED',
														'EXPENSE_SUBMITTED',
														'ERROR_OCCURRED',
														'LEAVE_APPROVED',
														'LEAVE_REJECTED',
														'EXPENSE_APPROVED',
														'EXPENSE_REJECTED',
														'SALARY_PAID',
														'PROFILE_UPDATED',
														'PASSWORD_CHANGED',
														'NOTIFICATION_SENT',
														'DOCUMENT_UPLOADED',
														'INVENTORY_CHECKED',
													],
												}).notNull(),
		employee_activity_timestamp      : integer()
			.notNull()
			.$defaultFn(() => Math.floor(Date.now() / 1000)),
		employee_activity_message        : text().notNull(),
		employee_activity_latitude       : real(),
		employee_activity_longitude      : real(),
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

export const employeesActivitiesRelations = relations(
	employeesActivities,
	({one}) => ({
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
	}),
);
