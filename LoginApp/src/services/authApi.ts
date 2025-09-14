import axios from "axios";

const API_BASE = "https://reqres.in/api";

export interface LoginResponse {
  token: string;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(`${API_BASE}/login`, { email, password });
  return res.data;
}
