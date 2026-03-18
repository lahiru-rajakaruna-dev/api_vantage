import {relations}                              from 'drizzle-orm';
import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
}                                               from 'drizzle-orm/sqlite-core';
import {clients}                                from './clients.table';
import {clientsPayments}                        from './clients_payments.table';
import {OrganizationStatus, SubscriptionStatus} from './common';
import {employees}                              from './employees.table';
import {employeesActivities}                    from './employees_activities.table';
import {employeesAttendances}                   from './employees_attendances.table';
import {employeesCredentials}                   from './employees_credentials.table';
import {employeesSalaryProfiles}                from './employees_salaries.table';
import {employeesSalaryRecords}                 from './employees_salary_records.table';
import {employeesSyncs}                         from './employees_syncs.table';
import {items}                                  from './items.table';
import {organizationsPayments}                  from './organizations_payments.table';
import {sales}                                  from './sales.table';
import {salesGroups}                            from './sales_groups.table';



export const organizations = sqliteTable(
	'organizations',
	{
		organization_id                   : text().notNull(),
		organization_admin_id             : text().unique().notNull(),
		organization_paddle_customer_id   : text().unique().notNull(),
		organization_name                 : text().unique().notNull(),
		organization_admin_email          : text().unique().notNull(),
		organization_admin_phone          : text().unique().notNull(),
		organization_logo_url             : text().unique().notNull(),
		organization_registration_date    : integer().notNull(),
		organization_subscription_end_date: integer().notNull(),
		organization_status               : text({enum: OrganizationStatus})
			.default('ACTIVE')
			.notNull(),
		organization_subscription_status  : text({enum: SubscriptionStatus})
			.default('VALID')
			.notNull(),
	},
	(table) => ({
		pk                 : primaryKey({
											name   : 'organization_primary_key',
											columns: [table.organization_id],
										}),
		organizationIdIndex: index('organization_id_idx').on(table.organization_id),
	}),
);

export const organizationsRelations = relations(organizations, ({many}) => ({
	employees              : many(employees),
	employeesCredentials   : many(employeesCredentials),
	employeesAttendances   : many(employeesAttendances),
	employeesActivities    : many(employeesActivities),
	employeesSalaryProfiles: many(employeesSalaryProfiles),
	employeesSalaryRecords : many(employeesSalaryRecords),
	employeesSyncs         : many(employeesSyncs),
	items                  : many(items),
	salesGroups            : many(salesGroups),
	organizationsPayments  : many(organizationsPayments),
	sales                  : many(sales),
	clients                : many(clients),
	clientsPayments        : many(clientsPayments),
}));
