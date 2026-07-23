import { api } from "./client";
import { Group } from "../types/models";

export async function listGroups() {
  const { data } = await api.get<Group[]>("/groups/");
  return data;
}

export async function getGroup(groupId: number) {
  const { data } = await api.get<Group>(`/groups/${groupId}/`);
  return data;
}

export async function createGroup(payload: { name: string; description?: string }) {
  const { data } = await api.post<Group>("/groups/", payload);
  return data;
}

// Adds a member via the membership endpoint.
// Backend UserGroup model uses FKs named `user_id` and `group_id`.
export async function addMember(groupId: number, userId: number) {
  const { data } = await api.post("/usersgroup/", { group_id: groupId, user_id: userId });
  return data;
}

