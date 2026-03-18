import {relations}      from 'drizzle-orm';
import {
	decimal,
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
}                       from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
}                       from 'drizzle-zod';
import {z}              from 'zod';
import {EPaymentStatus} from '../../../../types';
import {organizations}  from './organizations.table';



export const organizationsPayments = pgTable(
	'organizations_payments',
	{
		organization_payment_id             : text().unique().notNull(),
		organization_payment_organization_id: text().notNull(),
		organization_payment_amount         : decimal('payment_amount', {
			mode: 'number',
		}).notNull(),
		organization_payment_status         : text('payment_status', {
			enum: ['PENDING', 'PAID', 'VERIFIED', 'REFUNDED'],
		})
			.default(EPaymentStatus.VERIFIED)
			.notNull(),
		organization_payment_timestamp      : integer().notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'organization_payments_primary_key',
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
		};
	},
);

export const SchemaOrganizationPaymentInsert = createInsertSchema(
	organizationsPayments,
);
export const SchemaOrganizationPaymentData   =
				 SchemaOrganizationPaymentInsert.omit({
														  organization_payment_id             : true,
														  organization_payment_organization_id: true,
													  });
export const SchemaOrganizationPaymentUpdate = createUpdateSchema(
	organizationsPayments,
).omit({
		   organization_payment_id             : true,
		   organization_payment_organization_id: true,
	   });
export const SchemaOrganizationPaymentSelect = createSelectSchema(
	organizationsPayments,
);

export type TOrganizationPaymentInsert = z.infer<
	typeof SchemaOrganizationPaymentInsert
>;
export type TOrganizationPaymentData = z.infer<
	typeof SchemaOrganizationPaymentData
>;
export type TOrganizationPaymentUpdate = z.infer<
	typeof SchemaOrganizationPaymentUpdate
>;
export type TOrganizationPaymentSelect = z.infer<
	typeof SchemaOrganizationPaymentSelect
>;

export const organizationsPaymentsRelations = relations(
	organizationsPayments,
	({one}) => ({
		organization: one(organizations, {
			fields    : [organizationsPayments.organization_payment_organization_id],
			references: [organizations.organization_id],
		}),
	}),
);
