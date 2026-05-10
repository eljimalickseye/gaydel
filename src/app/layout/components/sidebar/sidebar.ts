import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconService } from '../../../core/services/icon.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-container coffee-gradient">
      <div class="logo-section">
        <div class="logo-icon" [innerHTML]="iconService.getIcon('coffee')"></div>
        <h1>GAYDEL</h1>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon" [innerHTML]="iconService.getIcon('dashboard')"></span>
          <span>Dashboard</span>
        </a>
        
        <ng-container *ngIf="authService.user$ | async as user">
          <!-- Super Admin Links -->
          <ng-container *ngIf="user.role === 'SUPER_ADMIN'">
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('users')"></span>
              <span>Utilisateurs</span>
            </a>
          </ng-container>

          <!-- Stock Manager Links -->
          <ng-container *ngIf="user.role === 'STOCK_MANAGER' || user.role === 'SUPER_ADMIN'">
            <a routerLink="/stock" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('stock')"></span>
              <span>Gestion Stock</span>
            </a>
          </ng-container>

          <!-- Sales Agent Links -->
          <ng-container *ngIf="user.role === 'SALES_AGENT' || user.role === 'SUPER_ADMIN'">
            <a routerLink="/prospects" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('prospects')"></span>
              <span>Prospects</span>
            </a>
          </ng-container>

          <!-- Seller Links -->
          <ng-container *ngIf="user.role === 'SELLER' || user.role === 'SUPER_ADMIN'">
            <a routerLink="/map" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('location')"></span>
              <span>Carte Vendeurs</span>
            </a>
            <a routerLink="/my-qr" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('qr')"></span>
              <span>Mon QR Code</span>
            </a>
          </ng-container>
        </ng-container>
      </nav>

      <div class="footer-section">
        <button (click)="authService.logout()" class="logout-btn">
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      width: 260px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      color: #e0d4c3;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;
      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: 2px;
      }
      .logo-icon { width: 32px; height: 32px; color: #fff; }
    }
    .nav-links {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: rgba(255,255,255,0.7);
      border-radius: 12px;
      transition: all 0.3s ease;
      .icon { width: 20px; height: 20px; }
      &:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
      &.active {
        background: rgba(255,255,255,0.15);
        color: #fff;
        font-weight: 600;
      }
    }
    .footer-section {
      margin-top: auto;
      padding-top: 20px;
    }
    .logout-btn {
      width: 100%;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #ff8a80;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      &:hover {
        background: rgba(255,138,128,0.1);
      }
    }
  `]
})
export class SidebarComponent {
  iconService = inject(IconService);
  authService = inject(AuthService);
}
