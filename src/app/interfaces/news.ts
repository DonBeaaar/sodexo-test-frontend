export interface ResponseApi {
  count: number;
  next: string;
  results: [News];
}

export interface News {
  id: number;
  title: string;
  url: string;
  news_site: string;
  summary: string;
  published_at: string;
  added_at?: string;
  favorite: boolean;
}
