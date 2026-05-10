import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { SellerMapComponent } from './features/seller-map/seller-map';
import { MyQRComponent } from './features/my-qr/my-qr';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: SellerMapComponent },
      { path: 'my-qr', component: MyQRComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
