import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser(); // get saved user from localStorage
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  goToStudents() {
    this.router.navigate(['/students']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
