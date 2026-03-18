import {pgEnum} from 'drizzle-orm/pg-core';
import {
	EAccountStatus,
	EOrganizationStatus,
	EPaymentStatus,
	ESubscriptionStatus,
}               from '../../../../types';



export type Prettify<T> = {
							  [K in keyof T]: T[K];
						  } & {};

export const EPGPaymentStatus = pgEnum('EPaymentStatus', EPaymentStatus);

export const EPGSubscriptionStatus = pgEnum(
	'ESubscriptionStatus',
	ESubscriptionStatus,
);
export const EPGOrganizationStatus = pgEnum(
	'EOrganizationStatus',
	EOrganizationStatus,
);
export const EPGAccountStatus      = pgEnum('EAccountStatus', EAccountStatus);

export const EPGActivityType = pgEnum('EActivityType', [
	'SALE_INITIALIZED',
	'SALE_CLOSED',
	'SALE_PROSPECTED',
	'DAY_OFF_REQUESTED',
	'REPORTED',
	'DATA_SYNCED',
	'LOGGED_OFF',
	'LOGGED_IN',
	'PAYMENT_ADDED',
	'CLIENT_ADDED',
	'CLIENT_UPDATED',
	'ITEM_ADDED',
	'ITEM_UPDATED',
	'CHECK_IN',
	'CHECK_OUT',
	'BREAK_STARTED',
	'BREAK_ENDED',
	'TRAVEL_STARTED',
	'TRAVEL_ENDED',
	'MEETING_ATTENDED',
	'TASK_COMPLETED',
	'REPORT_SUBMITTED',
	'EXPENSE_SUBMITTED',
	'ERROR_OCCURRED',
	'LEAVE_APPROVED',
	'LEAVE_REJECTED',
	'EXPENSE_APPROVED',
	'EXPENSE_REJECTED',
	'SALARY_PAID',
	'PROFILE_UPDATED',
	'PASSWORD_CHANGED',
	'NOTIFICATION_SENT',
	'DOCUMENT_UPLOADED',
	'INVENTORY_CHECKED',
] as const);
