import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
