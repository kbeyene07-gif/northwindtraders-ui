import { Routes } from '@angular/router';
import { CustomersPageComponent } from './features/customers/customers-page/customers-page.component';

import { authGuard } from './core/auth/auth.guard';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'customers' },

  { path: 'login', component: LoginPageComponent },

  {
    path: 'customers',
    component: CustomersPageComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'customers' }
];
