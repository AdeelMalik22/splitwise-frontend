import { api } from "./client";
export type Payment = { id:number; expense:number; payer:number; payee:number; amount:number|string; status:string; created_at:string; completed_at?:string|null };
export async function listPayments(){const {data}=await api.get<Payment[]>("/payments/");return data;}
export async function createPayment(payload:{expense:number;payer:number;payee:number;amount:number}){const {data}=await api.post<Payment>("/payments/",payload);return data;}
export async function updatePayment(id:number,payload:Partial<Payment>){const {data}=await api.patch<Payment>(`/payments/${id}/`,payload);return data;}
