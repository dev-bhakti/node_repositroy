import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  blogId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      summary: [''],
      status: ['draft', Validators.required],
      tags: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); //the route image after component initialized. map parameters extracted from url
    if (id) {
      this.isEditMode = true;
      this.blogId = parseInt(id);
      this.loadBlog(this.blogId);
    }
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        const blog = response.data.blog;
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content,
          summary: blog.summary,
          status: blog.status,
          tags: blog.tags ? blog.tags.join(', ') : ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load blog.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.blogForm.value;
    const blogData = {
      title: formValue.title,
      content: formValue.content,
      summary: formValue.summary,
      status: formValue.status,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    };

    const request = this.isEditMode && this.blogId
      ? this.blogService.updateBlog(this.blogId, blogData)
      : this.blogService.createBlog(blogData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['/my-blogs']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} blog.`;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/my-blogs']);
  }
}

