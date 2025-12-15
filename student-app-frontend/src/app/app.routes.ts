import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { WelcomeComponent } from './welcome.component';
import { StudentComponent } from './student.component/student.component';
import { authGuard } from './guards/authGuard';
import { StudentViewComponent } from './student.component/student-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [authGuard] },
  { path: 'students', component: StudentComponent, canActivate: [authGuard] },
  { path: 'students/:id', component: StudentViewComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
