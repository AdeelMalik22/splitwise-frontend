import { api } from "./client";
import { User, Group } from "../types/models";

export async function getMyProfile(userId: number) {
  const { data } = await api.get<User>(`/users/${userId}/`);
  return data;
}

export async function getMyGroups(userId: number) {
  const { data } = await api.get<Group[]>(`/users/${userId}/groups/`);
  return data;
}
