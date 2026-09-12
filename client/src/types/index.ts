// User Roles
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

// User Interface
export interface User {
  _id: string;
  email: string;
  pseudonym: string;
  bio?: string;
  avatar?: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Interfaces
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  pseudonym: string;
  password: string;
  bio?: string;
}

// Article Interfaces
export interface Article {
  _id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  author: {
    _id: string;
    pseudonym: string;
    avatar?: string;
  };
  isPublished: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Project Interfaces
export interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    _id: string;
    pseudonym: string;
    avatar?: string;
  };
  isPublished: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Event Interfaces
export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url?: string;
  newsArticle: {
    _id: string;
    title: string;
  };
  organizer: {
    _id: string;
    pseudonym: string;
    avatar?: string;
  };
  isPublic: boolean;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// Library Interfaces
export interface LibraryFile {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  tags: string[];
  language?: string;
  format?: string;
  author: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Forum Interfaces
export interface Thread {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    _id: string;
    pseudonym: string;
    avatar?: string;
  };
  isPinned: boolean;
  isLocked: boolean;
  messageCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  thread: string;
  author: {
    _id: string;
    pseudonym: string;
    avatar?: string;
  };
  parentMessage?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
