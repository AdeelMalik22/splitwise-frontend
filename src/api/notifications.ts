import { api } from "./client";
export type Notification = { id:number; notification_type:string; message:string; created_at:string; read_at:string|null };
export async function listNotifications(){const {data}=await api.get<Notification[]>("/notifications/");return data;}
export async function markNotificationRead(id:number){const {data}=await api.post<Notification>(`/notifications/${id}/mark_read/`);return data;}
