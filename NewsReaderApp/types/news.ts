export interface ArticleSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;                 // unique key
  urlToImage: string | null;
  publishedAt: string;         // ISO date
  content: string | null;
}

export interface NewsResponse {
  status: "ok" | "error";
  totalResults: number;
  articles: Article[];
}
