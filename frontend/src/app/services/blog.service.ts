import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Blog,
  BlogListResponse,
  BlogResponse,
  BookListResponse,
  CreateBlogRequest,
  UpdateBlogRequest
} from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;
  private apiUrl1 = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getAllBlogs(page: number = 1, limit: number = 10, status?: string, search?: string): Observable<BlogListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<BlogListResponse>(this.apiUrl, { params });
  }

  getAllBooks(page: number = 1, limit: number = 10): Observable<BookListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    // if (book_type) {
    //   params = params.set('status', book_type);
    // }
    
    // if (search) {
    //   params = params.set('search', search);
    // }

    return this.http.get<BookListResponse>(this.apiUrl, { params });
  }

  getBlogById(id: number): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.apiUrl}/${id}`);
  }

  createBlog(data: CreateBlogRequest): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(this.apiUrl, data);
  }

  updateBlog(id: number, data: UpdateBlogRequest): Observable<BlogResponse> {
    return this.http.put<BlogResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getUserBlogs(page: number = 1, limit: number = 10, status?: string): Observable<BlogListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<BlogListResponse>(`${this.apiUrl}/user/my-blogs`, { params });
  }
}

