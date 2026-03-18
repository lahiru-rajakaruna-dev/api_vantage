import {relations}       from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
}                        from 'drizzle-orm/sqlite-core';
import {clientsPayments} from './clients_payments.table';
import {AccountStatus}   from './common';
import {organizations}   from './organizations.table';
import {sales}           from './sales.table';



export const clients = sqliteTable(
	'clients',
	{
		client_id               : text().notNull(),
		client_organization_id  : text().notNull(),
		client_name             : text().notNull(),
		client_nic_number       : text().notNull(),
		client_email            : text().notNull(),
		client_phone            : text().notNull(),
		client_account_status   : text({enum: AccountStatus})
			.notNull()
			.default('UNVERIFIED'),
		client_registration_date: integer().notNull(),
	},
	(table) => ({
		pk                 : primaryKey({
											name   : 'clients_pk',
											columns: [table.client_id, table.client_organization_id],
										}),
		organizationFk     : foreignKey({
											name          : 'clients_organization_fk',
											columns       : [table.client_organization_id],
											foreignColumns: [organizations.organization_id],
										}),
		organizationIdIndex: index('client_organization_id_fk_idx').on(
			table.client_organization_id,
		),
	}),
);

export const clientsRelations = relations(clients, ({one, many}) => ({
	organization: one(organizations, {
		fields    : [clients.client_organization_id],
		references: [organizations.organization_id],
	}),
	payments    : many(clientsPayments),
	sales       : many(sales),
}));
