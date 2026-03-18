import {relations}     from 'drizzle-orm';
import {
	decimal,
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
import {employees}     from './employees.table';
import {organizations} from './organizations.table';



export const employeesSalaryRecords = pgTable(
	'employees_salary_records',
	{
		employee_salary_record_id             : text().unique().notNull(),
		employee_salary_record_organization_id: text().notNull(),
		employee_salary_record_employee_id    : text().notNull(),
		employee_salary_record_amount         : decimal({mode: 'number'}).notNull(),
		employee_salary_record_timestamp      : integer().notNull(),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employee_salary_record_pk',
												columns: [table.employee_salary_record_id],
											}),
			organizationFK     : foreignKey({
												name          : 'employee_salary_record_organization_FK',
												columns       : [table.employee_salary_record_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			employeeFK         : foreignKey({
												name          : 'employee_salary_record_employee_FK',
												columns       : [table.employee_salary_record_employee_id],
												foreignColumns: [employees.employee_id],
											}),
			organizationIdIndex: index(
				'employee_salary_record_organization_id_IDX',
			).on(table.employee_salary_record_organization_id),

			employeeIdIndex: index('employee_salary_record_employee_id_IDX').on(
				table.employee_salary_record_employee_id,
			),
		};
	},
);

export const SchemaInsertEmployeeSalaryRecord  = createInsertSchema(
	employeesSalaryRecords,
);
export const SchemaEmployeeSalaryRecordData    =
				 SchemaInsertEmployeeSalaryRecord.omit({
														   employee_salary_record_id             : true,
														   employee_salary_record_organization_id: true,
														   employee_salary_record_employee_id    : true,
													   });
export const SchemaUpdateEmployeesSalaryRecord = createUpdateSchema(
	employeesSalaryRecords,
).omit({
		   employee_salary_record_id             : true,
		   employee_salary_record_organization_id: true,
		   employee_salary_record_employee_id    : true,
	   });
export const SchemaSelectEmployeeSalaryRecord  = createSelectSchema(
	employeesSalaryRecords,
);

export type TEmployeeSalaryRecordInsert = z.infer<
	typeof SchemaInsertEmployeeSalaryRecord
>;
export type TEmployeeSalaryRecordData = z.infer<
	typeof SchemaEmployeeSalaryRecordData
>;
export type TEmployeeSalaryRecordUpdate = z.infer<
	typeof SchemaUpdateEmployeesSalaryRecord
>;
export type TEmployeeSalaryRecordSelect = z.infer<
	typeof SchemaSelectEmployeeSalaryRecord
>;

export const employeeSalaryRecordRelations = relations(
	employeesSalaryRecords,
	({one}) => {
		return {
			employee    : one(employees, {
				fields    : [employeesSalaryRecords.employee_salary_record_employee_id],
				references: [employees.employee_id],
			}),
			organization: one(organizations, {
				fields    : [employeesSalaryRecords.employee_salary_record_organization_id],
				references: [organizations.organization_id],
			}),
		};
	},
);
