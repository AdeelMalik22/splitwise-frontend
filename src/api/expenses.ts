import { api } from "./client";
import { Expense, SettlementsResponse } from "../types/models";

export async function listExpenses(groupId?: number) {
  // The backend filters by the authenticated user's groups automatically.
  // There is no `?group=` filter param — fetch all and filter client-side if needed.
  const { data } = await api.get<Expense[]>("/expense/");
  if (groupId !== undefined) {
    return data.filter((e) => e.group_id === groupId);
  }
  return data;
}

export async function createExpense(payload: {
  /** FK to Group — backend field name is `group_id` */
  group_id: number;
  /** Short label for the expense */
  name: string;
  description: string;
  amount: number;
  /** Array of user IDs who paid */
  paid_by: number[];
  /** Array of user IDs splitting the expense */
  split_on: number[];
}) {
  const { data } = await api.post<Expense>("/expense/", payload);
  return data;
}

export async function getSettlements(groupId: number) {
  const { data } = await api.get<SettlementsResponse>(`/expense/${groupId}/settlements/`);
  return data;
}

