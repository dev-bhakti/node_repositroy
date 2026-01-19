import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { MyBlogsComponent } from './components/my-blogs/my-blogs.component';

const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component:RegisterComponent},
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'create-blog', component: BlogFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-blog/:id', component: BlogFormComponent, canActivate: [AuthGuard] },
  { path: 'my-blogs', component: MyBlogsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

