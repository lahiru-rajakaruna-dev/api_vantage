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
import {clients}        from './clients.table';
import {organizations}  from './organizations.table';



export const clientsPayments = pgTable(
	'clients_payments',
	{
		client_payment_id             : text().unique().notNull(),
		client_payment_client_id      : text().notNull(),
		client_payment_organization_id: text().notNull(),
		client_payment_amount         : decimal('client_payment_amount', {
			mode: 'number',
		}).notNull(),
		client_payment_date           : integer().notNull(),
		client_payment_status         : text('client_payment_status', {
			enum: ['PENDING', 'PAID', 'VERIFIED', 'REFUNDED'],
		})
			.notNull()
			.default(EPaymentStatus.PENDING),
	},
	(table) => {
		return {
			pk                  : primaryKey({
												 name   : 'clients_payments_primary_key',
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
		};
	},
);

export const SchemaClientPaymentInsert = createInsertSchema(clientsPayments);
export const SchemaClientPaymentData   = SchemaClientPaymentInsert.omit({
																			client_payment_id             : true,
																			client_payment_client_id      : true,
																			client_payment_organization_id: true,
																		});
export const SchemaClientPaymentUpdate = createUpdateSchema(
	clientsPayments,
).omit({
		   client_payment_id             : true,
		   client_payment_client_id      : true,
		   client_payment_organization_id: true,
	   });
export const SchemaClientPaymentSelect = createSelectSchema(clientsPayments);

export type TClientPaymentInsert = z.infer<typeof SchemaClientPaymentInsert>;
export type TClientPaymentData = z.infer<typeof SchemaClientPaymentData>;
export type TClientPaymentUpdate = z.infer<typeof SchemaClientPaymentUpdate>;
export type TClientPaymentSelect = z.infer<typeof SchemaClientPaymentSelect>;

export const clientsPaymentsRelations = relations(
	clientsPayments,
	({one}) => {
		return {
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
		};
	},
);
