export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserPreferences {
    preferred_sources: string[];
    preferred_categories: string[];
    preferred_authors: string[];
}

export interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    source: string;
    published_at: string;
    image_url: string;
    url: string;
}