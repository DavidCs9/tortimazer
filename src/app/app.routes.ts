import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PriceComponent } from './pages/price/price.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'price', component: PriceComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
