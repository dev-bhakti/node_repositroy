import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  books:any;
  loading = false;
  errorMessage = '';
  
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  searchQuery = '';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.loadBooks();
  }

  loadBlogs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getAllBlogs(this.currentPage, this.limit, 'published', this.searchQuery).subscribe({
      next: (response) => {
        console.log(response,'blogs response');
        console.log(response.data,'response data')
        this.blogs = response.data.blogs;
        this.currentPage = response.data.pagination.page;
        this.totalPages = response.data.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load blogs.';
        this.loading = false;
      }
    });
  }

    loadBooks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getAllBooks(this.currentPage, this.limit).subscribe({
      next: (response) => {
        console.log(response,'blogs response');
        console.log(response.data,'response data')
        this.books = response.data.books;
        console.log('books',response.data);
        
        this.currentPage = response.data.pagination.page;
        this.totalPages = response.data.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load books.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  viewBlog(id: number): void {
    this.router.navigate(['/blog', id]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBlogs();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBlogs();
    }
  }

  getAuthorName(blog: Blog): string {
    if (blog.author) {
      const { firstName, lastName, username } = blog.author;
      // if (firstName && lastName && username) {
      //   return `${firstName} ${lastName} ${username}`;
      // }
       if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return username;
    }
    return 'Unknown';
  }
}

