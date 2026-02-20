import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})
export class MyBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  errorMessage = '';
  
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  filterStatus = '';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getUserBlogs(this.currentPage, this.limit, this.filterStatus || undefined).subscribe({
      next: (response) => {
        console.log(response, 'response');
        console.log(response.data, 'response data');
        this.blogs = response.data.blogs;
        this.currentPage = response.data.pagination.page;
        this.totalPages = response.data.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load your blogs.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  createBlog(): void {
    this.router.navigate(['/create-blog']);
    this.router.navigate(['/add-book']);

  }

  viewBlog(id: number): void {
    this.router.navigate(['/blog', id]);
  }

  editBlog(id: number): void {
    this.router.navigate(['/edit-blog', id]);
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.loadBlogs();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete blog.';
        }
      });
    }
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
}

