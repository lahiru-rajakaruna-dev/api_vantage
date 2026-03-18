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
} from './drizzle/drizzle-postgres/schema';
import {
	TEmployeeSalaryRecordData,
	TEmployeeSalaryRecordSelect,
} from './drizzle/drizzle-postgres/schema/employees_salary_records.table';



export default interface IOrmInterface {
	// --- ORGANIZATION ---
	addOrganization(
		organization_id: string,
		organization_admin_id: string,
		organization_stripe_customer_id: string,
		organizationDetails: TOrganizationData,
	): Promise<TOrganizationSelect>;

	getOrganizationDetailsById(
		organization_id: string,
	): Promise<TOrganizationSelect>;

	getOrganizationDetailsByAdminId(
		admin_id: string,
	): Promise<TOrganizationSelect>;

	updateOrganizationById(
		organization_id: string,
		organizationUpdates: TOrganizationUpdate,
	): Promise<TOrganizationSelect>;

	// --- EMPLOYEE (Transaction-based Onboarding) ---
	addEmployee(
		organization_id: string,
		employee_id: string,
		currentMonth: number,
		currentYear: number,
		employeeCredentials: TEmployeeCredentialsData,
	): Promise<TEmployeeSelect[]>;

	getEmployeeProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSelect>;

	getEmployeesByOrganizationId(
		organization_id: string,
	): Promise<TEmployeeSelect[]>;

	getEmployeesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TEmployeeSelect[]>;

	updateEmployeeById(
		organization_id: string,
		employee_id: string,
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]>;

	updateEmployeesByIds(
		organization_id: string,
		employees_ids: string[],
		employeeUpdates: TEmployeeUpdate,
	): Promise<TEmployeeSelect[]>;

	// --- EMPLOYEE CREDENTIALS (Security Update) ---
	updateEmployeeCredentials(
		organization_id: string,
		employee_id: string,
		credentialUpdates: TEmployeeCredentialsUpdate,
	): Promise<TEmployeeCredentialsSelect>;

	// --- EMPLOYEE ATTENDANCE ---
	getEmployeeAttendance(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeAttendanceSelect>;

	updateEmployeeAttendance(
		organization_id: string,
		employee_id: string,
		attendance_id: string,
		employeeAttendanceUpdates: TEmployeeAttendanceUpdate,
	): Promise<TEmployeeAttendanceSelect>;

	// --- EMPLOYEE ACTIVITY ---

	addEmployeeActivity(
		organization_id: string,
		employee_id: string,
		activity_id: string,
		employeeActivityData: TEmployeeActivityData,
	): Promise<TEmployeeActivitySelect[]>;

	getEmployeeActivityProfile(
		organization_id: string,
		employee_id: string,
		start_date?: number,
		end_date?: number,
	): Promise<TEmployeeActivitySelect[]>;

	// --- EMPLOYEE SYNC ---
	getEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSyncSelect>;

	updateEmployeeSyncProfileById(
		organization_id: string,
		employee_id: string,
		employeeSyncUpdates: TEmployeeSyncUpdate,
	): Promise<TEmployeeSyncSelect>;

	// --- EMPLOYEE SALARY ---
	getEmployeeSalaryProfileById(
		organization_id: string,
		employee_id: string,
	): Promise<TEmployeeSalaryProfileSelect>;

	getEmployeeSalaryRecords(
		organization_id: string,
		employee_id: string,
		monthStart?: number,
		monthEnd?: number,
	): Promise<TEmployeeSalaryRecordSelect[]>;

	addEmployeeSalaryRecord(
		organization_id: string,
		employee_id: string,
		employee_salary_record_id: string,
		salaryRecordData: TEmployeeSalaryRecordData,
	): Promise<TEmployeeSalaryRecordSelect[]>;

	updateEmployeeSalaryProfile(
		organization_id: string,
		employee_id: string,
		employeeSalaryProfileUpdates: TEmployeeSalaryProfileUpdate,
	): Promise<TEmployeeSalaryProfileSelect>;

	// --- ITEM ---
	addItem(
		organization_id: string,
		item_id: string,
		itemDetails: TItemData,
	): Promise<TItemSelect[]>;

	getItemById(organization_id: string, item_id: string): Promise<TItemSelect>;

	getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>;

	updateItemById(
		organization_id: string,
		item_id: string,
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]>;

	updateItemsByIds(
		organization_id: string,
		items_ids: string[],
		itemUpdates: TItemUpdate,
	): Promise<TItemSelect[]>;

	// --- SALES_GROUP ---
	addSalesGroup(
		organization_id: string,
		sales_group_id: string,
		salesGroupDetails: TSalesGroupData,
	): Promise<TSalesGroupSelect[]>;

	getSalesGroupsByOrganizationId(
		organization_id: string,
	): Promise<TSalesGroupSelect[]>;

	getSalesGroupDetailsById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect>;

	updateSalesGroupById(
		organization_id: string,
		sales_group_id: string,
		salesGroupUpdates: TSalesGroupUpdate,
	): Promise<TSalesGroupSelect[]>;

	deleteSalesGroupById(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSalesGroupSelect[]>;

	// --- SALE ---
	addSale(
		organization_id: string,
		employee_id: string,
		sale_id: string,
		saleDetails: TSaleData,
	): Promise<TSaleSelect[]>;

	getSaleById(organization_id: string, sale_id: string): Promise<TSaleSelect>;

	getSalesByEmployeeId(
		organization_id: string,
		employee_id: string,
	): Promise<TSaleSelect[]>;

	getSalesByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TSaleSelect[]>;

	getSalesByItemId(
		organization_id: string,
		item_id: string,
	): Promise<TSaleSelect[]>;

	getSalesBySalesGroupId(
		organization_id: string,
		sales_group_id: string,
	): Promise<TSaleSelect[]>;

	getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]>;

	getSalesByDate(organization_id: string, date: number): Promise<TSaleSelect[]>;

	getSalesWithinDates(
		organization_id: string,
		date_start: number,
		date_end: number,
	): Promise<TSaleSelect[]>;

	updateSaleById(
		organization_id: string,
		sale_id: string,
		saleUpdates: TSaleUpdate,
	): Promise<TSaleSelect[]>;

	// --- ORGANIZATION PAYMENT ---
	addOrganizationPayment(
		organization_id: string,
		organization_payment_id: string,
		paymentDetails: TOrganizationPaymentData,
	): Promise<TOrganizationPaymentSelect[]>;

	getOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TOrganizationPaymentSelect>;

	getOrganizationPaymentsByOrganizationId(
		organization_id: string,
	): Promise<TOrganizationPaymentSelect[]>;

	updateOrganizationPaymentById(
		organization_id: string,
		payment_id: string,
		paymentUpdates: TOrganizationPaymentUpdate,
	): Promise<TOrganizationPaymentSelect[]>;

	// --- CLIENT ---
	addClient(
		organization_id: string,
		client_id: string,
		clientDetails: TClientData,
	): Promise<TClientSelect[]>;

	getClientProfileById(
		organization_id: string,
		client_id: string,
	): Promise<TClientSelect>;

	getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>;

	updateClientById(
		organization_id: string,
		client_id: string,
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]>;

	updateClientsByIds(
		organization_id: string,
		clients_ids: string[],
		clientUpdates: TClientUpdate,
	): Promise<TClientSelect[]>;

	// --- CLIENT PAYMENTS ---
	addClientPayment(
		organization_id: string,
		client_id: string,
		client_payment_id: string,
		paymentDetails: TClientPaymentData,
	): Promise<TClientPaymentSelect[]>;

	getClientPaymentById(
		organization_id: string,
		payment_id: string,
	): Promise<TClientPaymentSelect>;

	getClientPaymentsByClientId(
		organization_id: string,
		client_id: string,
	): Promise<TClientPaymentSelect[]>;

	updateClientPaymentById(
		organization_id: string,
		payment_id: string,
		clientPaymentUpdates: TClientPaymentUpdate,
	): Promise<TClientPaymentSelect[]>;
}
