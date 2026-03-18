import {relations}                                 from 'drizzle-orm';
import {index, integer, pgTable, primaryKey, text} from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
}                                                  from 'drizzle-zod';
import {z}                                         from 'zod';
import {EOrganizationStatus, ESubscriptionStatus}  from '../../../../types';
import {clients}                                   from './clients.table';
import {clientsPayments}                           from './clients_payments.table';
import {employees}                                 from './employees.table';
import {employeesActivities}                       from './employees_activities';
import {employeesAttendances}                      from './employees_attendances.table';
import {employeesCredentials}                      from './employees_credentials';
import {employeesSalaryProfiles}                   from './employees_salaries.table';
import {employeesSalaryRecords}                    from './employees_salary_records.table';
import {employeesSyncs}                            from './employees_syncs.table';
import {items}                                     from './items.table';
import {organizationsPayments}                     from './organizations_payments.table';
import {sales}                                     from './sales.table';
import {salesGroups}                               from './sales_groups.table';



export const organizations = pgTable(
	'organizations',
	{
		organization_id                   : text().unique().notNull(),
		organization_admin_id             : text().unique().notNull(),
		organization_paddle_customer_id   : text().unique().notNull(),
		organization_name                 : text().unique().notNull(),
		organization_admin_email          : text().unique().notNull(),
		organization_admin_phone          : text().unique().notNull(),
		organization_logo_url             : text().unique().notNull(),
		organization_registration_date    : integer().notNull(),
		organization_subscription_end_date: integer().notNull(),
		organization_status               : text('organization_status', {
			enum: ['ACTIVE', 'DEACTIVATED', 'SUSPENDED', 'TRIAL'],
		})
			.default(EOrganizationStatus.ACTIVE)
			.notNull(),
		organization_subscription_status  : text('organization_subscription_status', {
			enum: ['VALID', 'EXPIRED'],
		})
			.default(ESubscriptionStatus.VALID)
			.notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'organization_primary_key',
												columns: [table.organization_id],
											}),
			organizationIdIndex: index('organization_id_idx').on(
				table.organization_id,
			),
			stripeIdIndex      : index('organization_stripe_customer_id_idx').on(
				table.organization_paddle_customer_id,
			),
		};
	},
);

export const SchemaInsertOrganization = createInsertSchema(organizations);
export const SchemaOrganizationData   = SchemaInsertOrganization.omit({
																		  organization_id                : true,
																		  organization_admin_id          : true,
																		  organization_paddle_customer_id: true,
																	  });
export const SchemaUpdateOrganization = createUpdateSchema(organizations).omit({
																				   organization_id                : true,
																				   organization_admin_id          : true,
																				   organization_paddle_customer_id: true,
																				   organization_registration_date : true,
																			   });
export const SchemaSelectOrganization = createSelectSchema(organizations);

export type TOrganizationInsert = z.infer<typeof SchemaInsertOrganization>;
export type TOrganizationData = z.infer<typeof SchemaOrganizationData>;
export type TOrganizationUpdate = z.infer<typeof SchemaUpdateOrganization>;
export type TOrganizationSelect = z.infer<typeof SchemaSelectOrganization>;

export const organizationsRelations = relations(organizations, ({many}) => {
	return {
		employees              : many(employees),
		employeesCredentials   : many(employeesCredentials),
		employeesAttendances   : many(employeesAttendances),
		employeesActivities    : many(employeesActivities),
		employeesSalaryProfiles: many(employeesSalaryProfiles),
		employeeSalaryRecords  : many(employeesSalaryRecords),
		employeesSyncs         : many(employeesSyncs),
		items                  : many(items),
		salesGroups            : many(salesGroups),
		organizationsPayments  : many(organizationsPayments),
		sales                  : many(sales),
		clients                : many(clients),
		clientsPayments        : many(clientsPayments),
	};
});
