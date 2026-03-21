export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail?: string;
  readingTime: string;
  content: string;
  series?: string;
}

export interface SiteConfig {
  name: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  website: string;
}
