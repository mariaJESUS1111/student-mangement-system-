import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any = null;

  constructor(private router: Router) {}

  register(userData: { firstName: string; lastName: string; email: string; password: string }) {
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    alert('Registration successful! You can now login.');
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): boolean {
    const storedUser = localStorage.getItem('registeredUser');
    if (!storedUser) {
      alert('No registered user found. Please register first.');
      this.router.navigate(['/register']);
      return false;
    }

    const user = JSON.parse(storedUser);
    if (user.email === email && user.password === password) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/welcome']);
      return true;
    } else {
      alert('Invalid email or password.');
      return false;
    }
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
