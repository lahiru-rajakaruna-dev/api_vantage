import {relations}       from 'drizzle-orm';
import {
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
import {EAccountStatus}  from '../../../../types';
import {clientsPayments} from './clients_payments.table';
import {organizations}   from './organizations.table';
import {sales}           from './sales.table';



export const clients = pgTable(
	'clients',
	{
		client_id               : text().unique().notNull(),
		client_organization_id  : text().notNull(),
		client_name             : text().notNull(),
		client_nic_number       : text().notNull(),
		client_email            : text().notNull(),
		client_phone            : text().notNull(),
		client_account_status   : text('client_account_status', {
			enum: ['ACTIVE', 'DEACTIVATED', 'UNVERIFIED'],
		})
			.notNull()
			.default(EAccountStatus.UNVERIFIED),
		client_registration_date: integer().notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'clients_primary_key',
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
		};
	},
);

export const SchemaClientInsert = createInsertSchema(clients);
export const SchemaClientData   = SchemaClientInsert.omit({
															  client_id             : true,
															  client_organization_id: true,
														  });
export const SchemaClientUpdate = createUpdateSchema(clients).omit({
																	   client_id             : true,
																	   client_organization_id: true,
																   });
export const SchemaClientSelect = createSelectSchema(clients);

export type TClientInsert = z.infer<typeof SchemaClientInsert>;
export type TClientData = z.infer<typeof SchemaClientData>;
export type TClientUpdate = z.infer<typeof SchemaClientUpdate>;
export type TClientSelect = z.infer<typeof SchemaClientSelect>;

export const clientsRelations = relations(clients, ({one, many}) => {
	return {
		organization: one(organizations, {
			fields    : [clients.client_organization_id],
			references: [organizations.organization_id],
		}),
		payments    : many(clientsPayments),
		sales       : many(sales),
	};
});
