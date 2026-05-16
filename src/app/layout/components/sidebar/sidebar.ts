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
          <ng-container *ngIf="user.role === 'SUPER_ADMIN' || user.email === 'admin@gaydel.com'">
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('users')"></span>
              <span>Utilisateurs</span>
            </a>
          </ng-container>

          <!-- Stock Manager Links -->
          <ng-container *ngIf="user.role === 'STOCK_MANAGER' || user.role === 'SUPER_ADMIN' || user.email === 'admin@gaydel.com'">
            <a routerLink="/stock" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('stock')"></span>
              <span>Gestion Stock</span>
            </a>
          </ng-container>

          <!-- Sales Agent Links -->
          <ng-container *ngIf="user.role === 'SALES_AGENT' || user.role === 'SUPER_ADMIN' || user.email === 'admin@gaydel.com'">
            <a routerLink="/prospects" routerLinkActive="active" class="nav-item">
              <span class="icon" [innerHTML]="iconService.getIcon('prospects')"></span>
              <span>Prospects</span>
            </a>
          </ng-container>

          <!-- Seller Links -->
          <ng-container *ngIf="user.role === 'SELLER' || user.role === 'SUPER_ADMIN' || user.email === 'admin@gaydel.com'">
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
      width: 280px; height: 100vh;
      background: linear-gradient(180deg, var(--primary) 0%, #1a0f0d 100%);
      display: flex; flex-direction: column;
      padding: 30px 20px; box-sizing: border-box;
      color: #fff; box-shadow: 10px 0 30px rgba(0,0,0,0.1);
      position: relative;
      z-index: 100;
    }
    .logo-section {
      display: flex; flex-direction: column; align-items: center;
      margin-bottom: 50px; text-align: center;
      h1 {
        margin: 10px 0 0; font-size: 1.5rem; font-weight: 800;
        letter-spacing: 4px; color: var(--accent);
        font-family: 'Outfit', sans-serif;
      }
      .logo-icon { 
        width: 42px; height: 42px; color: var(--accent); 
        filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3)); 
      }
    }
    .nav-links {
      flex: 1; display: flex; flex-direction: column; gap: 10px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 18px; text-decoration: none;
      color: rgba(255,255,255,0.6); border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      .icon { width: 20px; height: 20px; opacity: 0.8; }
      span { font-weight: 500; font-size: 0.9rem; }
      &:hover {
        background: rgba(255,255,255,0.05); color: #fff;
        transform: translateX(4px);
        .icon { opacity: 1; }
      }
      &.active {
        background: var(--accent); color: var(--primary);
        font-weight: 700; 
        box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
        .icon { color: var(--primary); opacity: 1; }
      }
    }
    .footer-section {
      margin-top: auto; padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .logout-btn {
      width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
      color: #ff8a80; cursor: pointer; font-weight: 600; font-size: 0.85rem;
      transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px;
      &:hover { background: #d32f2f; color: #fff; transform: translateY(-2px); }
    }
  `]
})
export class SidebarComponent {
  iconService = inject(IconService);
  authService = inject(AuthService);
}
