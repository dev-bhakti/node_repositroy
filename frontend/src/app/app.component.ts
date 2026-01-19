import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/auth.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BlogVerse';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => { //observable,stream of data apart from actual data
      console.log(this.currentUser,'currentUser')
      this.currentUser = user;
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}

