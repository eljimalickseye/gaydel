import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { SellerMapComponent } from './features/seller-map/seller-map';
import { MyQRComponent } from './features/my-qr/my-qr';
import { StockManagementComponent } from './features/stock-management/stock-management';
import { ProspectManagementComponent } from './features/prospect-management/prospect-management';
import { UserManagementComponent } from './features/user-management/user-management';
import { authGuard, roleGuard } from './core/guards/auth.guard';

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
      { path: 'stock', component: StockManagementComponent },
      { path: 'prospects', component: ProspectManagementComponent },
      { 
        path: 'admin/users', 
        component: UserManagementComponent,
        canActivate: [() => roleGuard(['SUPER_ADMIN'])]
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
