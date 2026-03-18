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
import {organizations} from './organizations.table';
import {sales}         from './sales.table';



export const items = pgTable(
	'items',
	{
		item_id              : text().unique().notNull(),
		item_organization_id : text().notNull(),
		item_name            : text().notNull(),
		item_stock_unit_count: integer().default(0),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'items_primary_key',
												columns: [table.item_id, table.item_organization_id],
											}),
			organizationFk     : foreignKey({
												name          : 'items_organization_fk',
												columns       : [table.item_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			itemIdIndex        : index('item_id_idx').on(table.item_id),
			organizationIdIndex: index('item_organization_id_fk_idx').on(
				table.item_organization_id,
			),
		};
	},
);

export const SchemaItemInsert = createInsertSchema(items);
export const SchemaItemData   = SchemaItemInsert.omit({
														  item_id             : true,
														  item_organization_id: true,
													  });
export const SchemaItemUpdate = createUpdateSchema(items).omit({
																   item_id             : true,
																   item_organization_id: true,
															   });
export const SchemaItemSelect = createSelectSchema(items);

export type TItemInsert = z.infer<typeof SchemaItemInsert>;
export type TItemData = z.infer<typeof SchemaItemData>;
export type TItemUpdate = z.infer<typeof SchemaItemUpdate>;
export type TItemSelect = z.infer<typeof SchemaItemSelect>;

export const itemsRelations = relations(items, ({one, many}) => {
	return {
		organization: one(organizations, {
			fields    : [items.item_organization_id],
			references: [organizations.organization_id],
		}),
		sales       : many(sales),
	};
});
