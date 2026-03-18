import {ConfigService}     from '@nestjs/config';
import type ILoggerService from '../../logger/logger.interface';
import IOrmInterface       from '../orm.interface';
import {
	TClientData,
	TClientPaymentData,
	TClientPaymentSelect,
	TClientPaymentUpdate,
	TClientSelect,
	TClientUpdate,
	TEmployeeActivityData,
	TEmployeeActivitySelect,
	TEmployeeAttendanceSelect,
	TEmployeeAttendanceUpdate,
	TEmployeeCredentialsData,
	TEmployeeCredentialsSelect,
	TEmployeeCredentialsUpdate,
	TEmployeeSalaryProfileSelect,
	TEmployeeSalaryProfileUpdate,
	TEmployeeSelect,
	TEmployeeSyncSelect,
	TEmployeeSyncUpdate,
	TEmployeeUpdate,
	TItemData,
	TItemSelect,
	TItemUpdate,
	TOrganizationData,
	TOrganizationPaymentData,
	TOrganizationPaymentSelect,
	TOrganizationPaymentUpdate,
	TOrganizationSelect,
	TOrganizationUpdate,
	TSaleData,
	TSaleSelect,
	TSalesGroupData,
	TSalesGroupSelect,
	TSalesGroupUpdate,
	TSaleUpdate,
}                          from './drizzle-postgres/schema';
import {
	TEmployeeSalaryRecordData,
	TEmployeeSalaryRecordSelect,
}                          from './drizzle-postgres/schema/employees_salary_records.table';



export default abstract class AbstractDrizzlerService implements IOrmInterface {
	protected readonly configService: ConfigService;
	protected readonly logger: ILoggerService;

	protected constructor(configService: ConfigService, logger: ILoggerService) {
		this.configService = configService;
		this.logger        = logger;
	}

	abstract addOrganization(
		organization_id: string,
		organization_admin_id: string,
		organization_stripe_customer_id: string,
		organizationDetails: TOrganizationData,
	): Promise<TOrganizationSelect>;

	abstract updateOrganizationById(
		organization_id: string,
		organizationUpdates: TOrganizationUpdate,
	): Promise<TOrganizationSelect>;

	// ORGANIZATION_PAYMENT
	abstract addOrganizationPayment(
		organization_id: string,
		organization_payment_id: string,
		paymentDetails: TOrganizationPaymentData,
	): Promise<TOrganizationPaymentSelect[]>;

	abstract updateOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
		paymentUpdates: TOrganizationPaymentUpdate,
	): Promise<TOrganizationPaymentSelect[]>;

	abstract getOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TOrganizationPaymentSelect>;

	abstract getOrganizationPaymentsByOrganizationId(
		organization_id: string,
	): Promise<TOrganizationPaymentSelect[]>;

	// EMPLOYEE

	abstract addEmployee(
		organization_id: string,
		employee_id: string,
		currentMonth: number,
		currentYear: number,
		employeeCredentials: TEmployeeCredentialsData,
	): Promise<TEmployeeSelect[]>;

	abstract updateEmployeeById(
		organization_id: string,
		employee_id: string,
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]>;

	abstract updateEmployeesByIds(
		organization_id: string,
		employees_ids: string[],
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]>;

	abstract getEmployeeProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSelect>;

	abstract getEmployeesByOrganizationId(
		organization_id: string,
	): Promise<TEmployeeSelect[]>;

	abstract getEmployeesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TEmployeeSelect[]>;

	//     EMPLOYEE_CREDENTIALS

	abstract updateEmployeeCredentials(
		organization_id: string,
		employee_id: string,
		credentialUpdates: TEmployeeCredentialsUpdate,
	): Promise<TEmployeeCredentialsSelect>;

	//     EMPLOYEE_ATTENDANCE
	abstract getEmployeeAttendance(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeAttendanceSelect>;

	abstract updateEmployeeAttendance(
		organization_id: string,
		employee_id: string,
		attendance_id: string,
		employeeAttendanceUpdates: TEmployeeAttendanceUpdate,
	): Promise<TEmployeeAttendanceSelect>;

	//     EMPLOYEE ACTIVITY
	abstract addEmployeeActivity(
		organization_id: string,
		employee_id: string,
		activity_id: string,
		employeeActivityData: TEmployeeActivityData,
	): Promise<TEmployeeActivitySelect[]>;

	abstract getEmployeeActivityProfile(
		organization_id: string,
		employee_id: string,
		start_date?: number,
		end_date?: number,
	): Promise<TEmployeeActivitySelect[]>;

	// EMPLOYEE SYNC
	abstract getEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSyncSelect>;

	abstract updateEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
		employeeSyncUpdates: TEmployeeSyncUpdate,
	): Promise<TEmployeeSyncSelect>;

	//     EMPLOYEE_SALARY

	abstract getEmployeeSalaryProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSalaryProfileSelect>;

	abstract getEmployeeSalaryRecords(
		organization_id: string,
		employee_id: string,
		monthStart?: number,
		monthEnd?: number,
	): Promise<TEmployeeSalaryRecordSelect[]>;

	abstract addEmployeeSalaryRecord(
		organization_id: string,
		employee_id: string,
		employee_salary_record_id: string,
		salaryRecordData: TEmployeeSalaryRecordData,
	): Promise<TEmployeeSalaryRecordSelect[]>;

	abstract updateEmployeeSalaryProfile(
		organization_id: string,
		employee_id: string,
		employeeSalaryProfileUpdates: TEmployeeSalaryProfileUpdate,
	): Promise<TEmployeeSalaryProfileSelect>;

	abstract getOrganizationDetailsByAdminId(
		admin_id: string,
	): Promise<TOrganizationSelect>;

	abstract getOrganizationDetailsById(
		organization_id: string,
	): Promise<TOrganizationSelect>;

	//     SALES_GROUP

	abstract addSalesGroup(
		organization_id: string,
		sales_group_id: string,
		salesGroupDetails: TSalesGroupData,
	): Promise<TSalesGroupSelect[]>;

	abstract updateSalesGroupById(
		organization_id: string,
		sales_group_id: string,
		salesGroupUpdates: TSalesGroupUpdate,
	): Promise<TSalesGroupSelect[]>;

	abstract getSalesGroupDetailsById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect>;

	abstract getSalesGroupsByOrganizationId(
		organization_id: string,
	): Promise<TSalesGroupSelect[]>;

	abstract deleteSalesGroupById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect[]>;

	//     CLIENT
	abstract addClient(
		organization_id: string,
		client_id: string,
		clientDetails: TClientData,
	): Promise<TClientSelect[]>;

	abstract updateClientById(
		organization_id: string,
		client_id: string,
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]>;

	abstract updateClientsByIds(
		organization_id: string,
		clients_ids: string[],
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]>;

	abstract getClientProfileById(
		organization_id: string,
		client_id: string,
	): Promise<TClientSelect>;

	abstract getClientsByOrganizationId(
		organization_id: string,
	): Promise<TClientSelect[]>;

	//     CLIENT_PAYMENT
	abstract addClientPayment(
		organization_id: string,
		client_id: string,
		client_payment_id: string,
		paymentDetails: TClientPaymentData,
	): Promise<TClientPaymentSelect[]>;

	abstract updateClientPaymentById(
		organization_id: string,
		payment_id: string,
		clientPaymentUpdates: TClientPaymentUpdate,
	): Promise<TClientPaymentSelect[]>;

	abstract getClientPaymentsByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TClientPaymentSelect[]>;

	abstract getClientPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TClientPaymentSelect>;

	//     ITEM
	abstract addItem(
		organization_id: string,
		item_id: string,
		itemDetails: TItemData,
	): Promise<TItemSelect[]>;

	abstract updateItemById(
		organization_id: string,
		item_id: string,
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]>;

	abstract updateItemsByIds(
		organization_id: string,
		items_ids: string[],
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]>;

	abstract getItemsByOrganizationId(
		organization_id: string,
	): Promise<TItemSelect[]>;

	abstract getItemById(
		organization_id: string,
		item_id: string,
	): Promise<TItemSelect>;

	//     SALE
	abstract addSale(
		organization_id: string,
		employee_id: string,
		sale_id: string,
		saleDetails: TSaleData,
	): Promise<TSaleSelect[]>;

	abstract getSaleById(
		organization_id: string,
		sale_id: string,
	): Promise<TSaleSelect>;

	abstract getSalesByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TSaleSelect[]>;

	abstract getSalesByEmployeeId(
		organization_id: string,
		employee_id: string,
	): Promise<TSaleSelect[]>;

	abstract getSalesByItemId(
		organization_id: string,
		item_id: string,
	): Promise<TSaleSelect[]>;

	abstract getSalesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSaleSelect[]>;

	abstract getSalesByOrganizationId(
		organization_id: string,
	): Promise<TSaleSelect[]>;

	abstract getSalesByDate(
		organization_id: string,
		date: number,
	): Promise<TSaleSelect[]>;

	abstract getSalesWithinDates(
		organization_id: string,
		date_start: number,
		date_end: number,
	): Promise<TSaleSelect[]>;

	abstract updateSaleById(
		organization_id: string,
		sale_id: string,
		saleUpdates: TSaleUpdate,
	): Promise<TSaleSelect[]>;
}
