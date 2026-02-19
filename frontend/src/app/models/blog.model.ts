export interface Blog {
  id: number;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  userId: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface Book {
  id: number;
  title: string;
  // content: string;
  // summary?: string;
  // slug: string;
  // userId: number;
  book_type: string;
  publishedBy: string;
  price: number;
  // createdAt: string;
  // updatedAt: string;
  author?: {
    id: number;
    // username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface BookListResponse {
  success: boolean;
  data: {
    books: Book[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface BlogListResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: {
    blog: Blog;
  };
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  summary?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  summary?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
}

