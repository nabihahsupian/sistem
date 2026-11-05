export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  htmlContent: string;
  isPublished: boolean;
  userId: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  authorName?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Promosi' | 'Bisnes' | 'Sosial' | 'Acara' | 'Pendidikan' | 'Asas';
  tags: string[];
  htmlContent: string;
}
