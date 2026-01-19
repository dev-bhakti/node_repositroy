import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/auth.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loading = false;

  constructor(
    private authService: AuthService
  ) {
  
  }
    currentUser: User | null = null;
  

  ngOnInit(): void {
     this.viewProf();
  }
   
  viewProf(){
    this.authService.currentUser$.subscribe(user => { //observable,stream of data apart from actual data
      this.currentUser = user;
      console.log(this.currentUser,'currentUser')
      
    });
  }
}
