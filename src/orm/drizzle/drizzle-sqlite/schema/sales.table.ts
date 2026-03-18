import {relations}                from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
}                                 from 'drizzle-orm/sqlite-core';
import {employees}                from './employees.table';
import {clients, clientsPayments} from './index';
import {items}                    from './items.table';
import {organizations}            from './organizations.table';



export const sales = sqliteTable(
	'sales',
	{
		sale_id               : text().notNull(),
		sale_organization_id  : text().notNull(),
		sale_employee_id      : text().notNull(),
		sale_client_id        : text().notNull(),
		sale_client_payment_id: text().notNull(),
		sale_item_id          : text().notNull(),
		sale_item_unit_count  : integer().notNull().default(1),
		sale_value            : real().notNull(),
		sale_date             : integer().notNull(),
	},
	(table) => ({
		pk                  : primaryKey({
											 name   : 'sales_pk',
											 columns: [
												 table.sale_id,
												 table.sale_organization_id,
												 table.sale_employee_id,
												 table.sale_client_id,
												 table.sale_client_payment_id,
												 table.sale_item_id,
											 ],
										 }),
		organizationFk      : foreignKey({
											 name          : 'sales_organization_fk',
											 columns       : [table.sale_organization_id],
											 foreignColumns: [organizations.organization_id],
										 }),
		employeeFk          : foreignKey({
											 name          : 'sales_employee_fk',
											 columns       : [table.sale_employee_id, table.sale_organization_id],
											 foreignColumns: [
												 employees.employee_id,
												 employees.employee_organization_id,
											 ],
										 }),
		clientFk            : foreignKey({
											 name          : 'sales_client_fk',
											 columns       : [table.sale_client_id, table.sale_organization_id],
											 foreignColumns: [clients.client_id, clients.client_organization_id],
										 }),
		clientPaymentFk     : foreignKey({
											 name          : 'sales_client_payment_fk',
											 columns       : [table.sale_client_payment_id, table.sale_organization_id],
											 foreignColumns: [
												 clientsPayments.client_payment_id,
												 clientsPayments.client_payment_organization_id,
											 ],
										 }),
		itemFk              : foreignKey({
											 name          : 'sales_item_fk',
											 columns       : [table.sale_item_id, table.sale_organization_id],
											 foreignColumns: [items.item_id, items.item_organization_id],
										 }),
		saleIdIndex         : index('sale_id_idx').on(table.sale_id),
		organizationIdIndex : index('sale_organization_id_fk_idx').on(
			table.sale_organization_id,
		),
		employeeIdIndex     : index('sale_employee_id_fk_idx').on(
			table.sale_employee_id,
		),
		clientIdIndex       : index('sale_client_id_fk_idx').on(table.sale_client_id),
		clientPaymentIdIndex: index('sale_client_payment_id_fk_idx').on(
			table.sale_client_payment_id,
		),
		itemIdIndex         : index('sale_item_id_fk_idx').on(table.sale_item_id),
	}),
);

export const salesRelations = relations(sales, ({one}) => ({
	item         : one(items, {
		fields    : [sales.sale_item_id, sales.sale_organization_id],
		references: [items.item_id, items.item_organization_id],
	}),
	employee     : one(employees, {
		fields    : [sales.sale_employee_id, sales.sale_organization_id],
		references: [employees.employee_id, employees.employee_organization_id],
	}),
	organization : one(organizations, {
		fields    : [sales.sale_organization_id],
		references: [organizations.organization_id],
	}),
	client       : one(clients, {
		fields    : [sales.sale_client_id, sales.sale_organization_id],
		references: [clients.client_id, clients.client_organization_id],
	}),
	clientPayment: one(clientsPayments, {
		fields    : [sales.sale_client_payment_id, sales.sale_organization_id],
		references: [
			clientsPayments.client_payment_id,
			clientsPayments.client_payment_organization_id,
		],
	}),
}));
