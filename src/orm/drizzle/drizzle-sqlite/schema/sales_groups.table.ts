import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
	primaryKey,
	sqliteTable,
	text,
}                      from 'drizzle-orm/sqlite-core';
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const salesGroups = sqliteTable(
	'sales_groups',
	{
		sales_group_id             : text().notNull(),
		sales_group_organization_id: text().notNull(),
		sales_group_name           : text().unique().notNull(),
		sales_group_territory      : text().notNull(),
	},
	(table) => ({
		pk                 : primaryKey({
											name   : 'sales_groups_pk',
											columns: [table.sales_group_id, table.sales_group_organization_id],
										}),
		organizationFk     : foreignKey({
											name          : 'sales_groups_organization_fk',
											columns       : [table.sales_group_organization_id],
											foreignColumns: [organizations.organization_id],
										}),
		organizationIdIndex: index('sales_group_organization_id_fk_idx').on(
			table.sales_group_organization_id,
		),
		nameIndex          : index('sales_group_name_unique_idx').on(table.sales_group_name),
	}),
);

export const salesGroupsRelations = relations(salesGroups, ({one, many}) => ({
	organization: one(organizations, {
		fields    : [salesGroups.sales_group_organization_id],
		references: [organizations.organization_id],
	}),
	employees   : many(employees),
}));
