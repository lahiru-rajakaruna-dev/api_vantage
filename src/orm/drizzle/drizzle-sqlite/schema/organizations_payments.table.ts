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
import {PaymentStatus} from './common';
import {organizations} from './organizations.table';



export const organizationsPayments = sqliteTable(
	'organizations_payments',
	{
		organization_payment_id             : text().notNull(),
		organization_payment_organization_id: text().notNull(),
		organization_payment_amount         : real().notNull(),
		organization_payment_status         : text({enum: PaymentStatus})
			.default('VERIFIED')
			.notNull(),
		organization_payment_timestamp      : integer().notNull(),
	},
	(table) => ({
		pk                 : primaryKey({
											name   : 'organizations_payments_pk',
											columns: [
												table.organization_payment_id,
												table.organization_payment_organization_id,
											],
										}),
		organizationFk     : foreignKey({
											name          : 'organizations_payments_organization_fk',
											columns       : [table.organization_payment_organization_id],
											foreignColumns: [organizations.organization_id],
										}),
		paymentIdIndex     : index('organization_payment_id_idx').on(
			table.organization_payment_id,
		),
		organizationIdIndex: index(
			'organization_payment_organization_id_fk_idx',
		).on(table.organization_payment_organization_id),
	}),
);

export const organizationsPaymentsRelations = relations(
	organizationsPayments,
	({one}) => ({
		organization: one(organizations, {
			fields    : [organizationsPayments.organization_payment_organization_id],
			references: [organizations.organization_id],
		}),
	}),
);
