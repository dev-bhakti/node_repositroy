import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = false;
  errorMessage = '';
  isAuthor = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlog(parseInt(id));
    }
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        this.blog = response.data.blog;
        this.loading = false;
        
        const currentUser = this.authService.getCurrentUser();
        this.isAuthor = currentUser?.id === this.blog.userId;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load blog.';
        this.loading = false;
      }
    });
  }

  editBlog(): void {
    if (this.blog) {
      this.router.navigate(['/edit-blog', this.blog.id]);
    }
  }

  deleteBlog(): void {
    if (this.blog && confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(this.blog.id).subscribe({
        next: () => {
          this.router.navigate(['/my-blogs']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete blog.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getAuthorName(): string {
    if (this.blog?.author) {
      const { firstName, lastName, username } = this.blog.author;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return username;
    }
    return 'Unknown';
  }
}

