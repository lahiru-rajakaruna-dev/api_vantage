import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
}                      from 'drizzle-orm/sqlite-core';
import {organizations} from './organizations.table';
import {sales}         from './sales.table';



export const items = sqliteTable(
	'items',
	{
		item_id              : text().notNull(),
		item_organization_id : text().notNull(),
		item_name            : text().notNull(),
		item_stock_unit_count: integer().default(0),
	},
	(table) => ({
		pk                 : primaryKey({
											name   : 'items_pk',
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
	}),
);

export const itemsRelations = relations(items, ({one, many}) => ({
	organization: one(organizations, {
		fields    : [items.item_organization_id],
		references: [organizations.organization_id],
	}),
	sales       : many(sales),
}));
