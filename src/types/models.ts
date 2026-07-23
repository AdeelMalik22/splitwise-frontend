export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  members?: User[];
  /** Backend field name is `created` (auto_now_add DateTimeField) */
  created?: string;
}

export interface Membership {
  id: number;
  /** Backend FK field serialized as `user_id` */
  user_id: number;
  /** Backend FK field serialized as `group_id` */
  group_id: number;
}

/**
 * Matches the backend Expense model exactly.
 * - `group_id`  : FK to Group (DRF serializes FK as `<field>_id`)
 * - `name`      : short label for the expense
 * - `paid_by`   : array of payer user IDs  (ArrayField)
 * - `split_on`  : array of participant IDs (ArrayField)
 * - `amount`    : FloatField returned as number
 */
export interface Expense {
  id: number;
  /** FK — serialized by DRF as `group_id` */
  group_id: number;
  name: string;
  description: string;
  amount: number;
  /** Array of user IDs who paid */
  paid_by: number[];
  /** Array of user IDs splitting the expense */
  split_on: number[];
  created_at?: string;
  updated_at?: string;
}

/** Shape of each item inside the settlement lists returned by the backend */
export interface SettlementEntry {
  /** Username string of the person to pay / who pays */
  to_user?: string;
  from_user?: string;
  amount: number;
}

/**
 * The backend returns an object — NOT a flat array.
 * `GET /expense/{groupId}/settlements/`
 */
export interface SettlementsResponse {
  "You need to pay": SettlementEntry[];
  "you will get": SettlementEntry[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
