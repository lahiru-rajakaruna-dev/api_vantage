import {relations}     from 'drizzle-orm';
import {
	foreignKey,
	index,
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
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const salesGroups = pgTable(
	'sales_groups',
	{
		sales_group_id             : text().unique().notNull(),
		sales_group_organization_id: text().notNull(),
		sales_group_name           : text().unique().notNull(),
		sales_group_territory      : text().notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'sales_group_primary_key',
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
			nameIndex          : index('sales_group_name_unique_idx').on(
				table.sales_group_name,
			),
		};
	},
);

export const SchemaSalesGroupInsert = createInsertSchema(salesGroups);
export const SchemaSalesGroupData   = SchemaSalesGroupInsert.omit({
																	  sales_group_id             : true,
																	  sales_group_organization_id: true,
																  });
export const SchemaSalesGroupUpdate = createUpdateSchema(salesGroups).omit({
																			   sales_group_id             : true,
																			   sales_group_organization_id: true,
																		   });
export const SchemaSalesGroupSelect = createSelectSchema(salesGroups);

export type TSalesGroupInsert = z.infer<typeof SchemaSalesGroupInsert>;
export type TSalesGroupData = z.infer<typeof SchemaSalesGroupData>;
export type TSalesGroupUpdate = z.infer<typeof SchemaSalesGroupUpdate>;
export type TSalesGroupSelect = z.infer<typeof SchemaSalesGroupSelect>;

export const salesGroupsRelations = relations(salesGroups, ({one, many}) => {
	return {
		organization: one(organizations, {
			fields    : [salesGroups.sales_group_organization_id],
			references: [organizations.organization_id],
		}),
		employees   : many(employees),
	};
});
