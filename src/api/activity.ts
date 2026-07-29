import { api } from "./client";
export type Activity = { id:number; actor:number; action:string; entity_type:string; entity_id:number; metadata?:Record<string,unknown>; created_at:string };
export async function listActivity(){const {data}=await api.get<Activity[]>("/activity/");return data;}
