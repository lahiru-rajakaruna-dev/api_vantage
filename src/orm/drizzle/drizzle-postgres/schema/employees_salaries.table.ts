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



export const employeesSalaryProfiles = pgTable(
	'employees_salary_profiles',
	{
		employee_salary_profile_id                   : text().unique().notNull(),
		employee_salary_profile_organization_id      : text().notNull(),
		employee_salary_profile_employee_id          : text().notNull(),
		employee_salary_profile_base                 : decimal('employee_salary_base', {
			mode: 'number',
		}).notNull(),
		employee_salary_profile_commission_percentage: integer()
			.notNull()
			.default(0),
	},
	(table) => {
		return {
			pk                 : primaryKey({
												name   : 'employees_salary_profile_pk',
												columns: [
													table.employee_salary_profile_id,
													table.employee_salary_profile_organization_id,
													table.employee_salary_profile_employee_id,
												],
											}),
			employeeFk         : foreignKey({
												name          : 'employees_salary_profile_employee_fk',
												columns       : [
													table.employee_salary_profile_employee_id,
													table.employee_salary_profile_organization_id,
												],
												foreignColumns: [
													employees.employee_id,
													employees.employee_organization_id,
												],
											}),
			organizationFk     : foreignKey({
												name          : 'employees_salary_profile_organization_fk',
												columns       : [table.employee_salary_profile_organization_id],
												foreignColumns: [organizations.organization_id],
											}),
			salaryIdIndex      : index('employee_salary_profile_id_idx').on(
				table.employee_salary_profile_id,
			),
			organizationIdIndex: index(
				'employee_salary_profile_organization_id_fk_idx',
			).on(table.employee_salary_profile_organization_id),
			employeeIdIndex    : index('employee_salary_profile_employee_id_fk_idx').on(
				table.employee_salary_profile_employee_id,
			),
		};
	},
);

export const SchemaEmployeeSalaryProfileInsert = createInsertSchema(
	employeesSalaryProfiles,
);
export const SchemaEmployeeSalaryProfileData   =
				 SchemaEmployeeSalaryProfileInsert.omit({
															employee_salary_profile_id             : true,
															employee_salary_profile_organization_id: true,
															employee_salary_profile_employee_id    : true,
														});
export const SchemaEmployeeSalaryProfileUpdate = createUpdateSchema(
	employeesSalaryProfiles,
).omit({
		   employee_salary_profile_id             : true,
		   employee_salary_profile_organization_id: true,
		   employee_salary_profile_employee_id    : true,
	   });
export const SchemaEmployeeSalaryProfileSelect = createSelectSchema(
	employeesSalaryProfiles,
);

export type TEmployeeSalaryProfileInsert = z.infer<
	typeof SchemaEmployeeSalaryProfileInsert
>;
export type TEmployeeSalaryProfileData = z.infer<
	typeof SchemaEmployeeSalaryProfileData
>;
export type TEmployeeSalaryProfileUpdate = z.infer<
	typeof SchemaEmployeeSalaryProfileUpdate
>;
export type TEmployeeSalaryProfileSelect = z.infer<
	typeof SchemaEmployeeSalaryProfileSelect
>;

export const employeesSalaryProfileRelations = relations(
	employeesSalaryProfiles,
	({one}) => {
		return {
			organization: one(organizations, {
				fields    : [
					employeesSalaryProfiles.employee_salary_profile_organization_id,
				],
				references: [organizations.organization_id],
			}),
			employee    : one(employees, {
				fields    : [
					employeesSalaryProfiles.employee_salary_profile_employee_id,
					employeesSalaryProfiles.employee_salary_profile_organization_id,
				],
				references: [employees.employee_id, employees.employee_organization_id],
			}),
		};
	},
);
