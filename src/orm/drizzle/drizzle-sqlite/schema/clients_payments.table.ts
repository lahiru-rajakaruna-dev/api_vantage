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
import {clients}       from './clients.table';
import {PaymentStatus} from './common';
import {organizations} from './organizations.table';



export const clientsPayments = sqliteTable(
	'clients_payments',
	{
		client_payment_id             : text().notNull(),
		client_payment_client_id      : text().notNull(),
		client_payment_organization_id: text().notNull(),
		client_payment_amount         : real().notNull(),
		client_payment_date           : integer().notNull(),
		client_payment_status         : text({enum: PaymentStatus})
			.notNull()
			.default('PENDING'),
	},
	(table) => ({
		pk                  : primaryKey({
											 name   : 'clients_payments_pk',
											 columns: [
												 table.client_payment_id,
												 table.client_payment_client_id,
												 table.client_payment_organization_id,
											 ],
										 }),
		clientFk            : foreignKey({
											 name          : 'clients_payments_client_fk',
											 columns       : [
												 table.client_payment_client_id,
												 table.client_payment_organization_id,
											 ],
											 foreignColumns: [clients.client_id, clients.client_organization_id],
										 }),
		organizationFk      : foreignKey({
											 name          : 'clients_payments_organization_fk',
											 columns       : [table.client_payment_organization_id],
											 foreignColumns: [organizations.organization_id],
										 }),
		clientPaymentIdIndex: index('client_payment_id_idx').on(
			table.client_payment_id,
		),
		clientIdIndex       : index('client_payment_client_id_fk_idx').on(
			table.client_payment_client_id,
		),
		organizationIdIndex : index('client_payment_organization_id_fk_idx').on(
			table.client_payment_organization_id,
		),
	}),
);

export const clientsPaymentsRelations = relations(
	clientsPayments,
	({one}) => ({
		client      : one(clients, {
			fields    : [
				clientsPayments.client_payment_client_id,
				clientsPayments.client_payment_organization_id,
			],
			references: [clients.client_id, clients.client_organization_id],
		}),
		organization: one(organizations, {
			fields    : [clientsPayments.client_payment_organization_id],
			references: [organizations.organization_id],
		}),
	}),
);
