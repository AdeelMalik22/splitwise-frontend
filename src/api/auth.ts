import { api } from "./client";
import { AuthTokens } from "../types/models";

export async function login(username: string, password: string) {
  const { data } = await api.post<AuthTokens>("/login/", { username, password });
  return data;
}

export async function register(payload: {
  username: string;
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post("/users/register/", payload);
  return data;
}
