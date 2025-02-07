export interface Article {
  id: number;
  title: string;
  description: string;
  content?: string;
  source: string;
  category: string;
  author?: string;
  published_at: string;
  image_url?: string;
  url?: string;
}

export interface PaginatedArticles {
  current_page: number;
  data: Article[];
  total: number;
}
