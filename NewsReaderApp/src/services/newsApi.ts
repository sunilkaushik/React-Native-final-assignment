import axios from "axios";
import type { NewsResponse } from "../../types/news";

const API_KEY = "ff95d14c881b441998147ed275e379e5"; // <- replace
const BASE_URL = "https://newsapi.org/v2";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export async function fetchTopHeadlines(
  page: number,
  pageSize: number = 20,
  country: string = "us"
): Promise<NewsResponse> {
  const { data } = await api.get<NewsResponse>("/top-headlines", {
    params: { country, page, pageSize, apiKey: API_KEY },
  });
  return data;
}
