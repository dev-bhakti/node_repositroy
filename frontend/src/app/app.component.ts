import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/auth.model';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BookNest';
  currentUser: User | null = null;

  
 showLoginBtn = false;
  showRegisterBtn = false;

  private destroy$ = new Subject<void>();


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => { //observable,stream of data apart from actual data
      console.log(this.currentUser,'currentUser')
      this.currentUser = user;
    });

    
this.updateButtons(this.router.url);

    // Update on every navigation end
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(e => this.updateButtons(e.urlAfterRedirects));

  }

private updateButtons(url: string): void {
    const onLogin = url.includes('/login');
    const onRegister = url.includes('/register');

    this.showRegisterBtn = onLogin;   // show "Register" when on login
    this.showLoginBtn = onRegister;   // show "Login" when on register
  }

  viewProfile(){
     this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToLoginPage():void{
    this.router.navigate(['/login']);
  }

  goToRegisterPage():void{
    this.router.navigate(['/register']);
  }

  
 ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

