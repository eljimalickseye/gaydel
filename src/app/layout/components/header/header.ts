import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container glass-card">
      <div class="search-bar">
        <input type="text" placeholder="Rechercher...">
      </div>
      
      <div class="user-profile">
        <div class="theme-toggle" (click)="themeService.toggleTheme()">
          <svg *ngIf="!themeService.isDarkMode()" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg *ngIf="themeService.isDarkMode()" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </div>
        <div class="notifications-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="divider"></div>
        <ng-container *ngIf="authService.user$ | async as user">
          <div class="info">
            <span class="name">{{ user.displayName || 'Utilisateur' }}</span>
            <span class="role">{{ user.role }}</span>
          </div>
          <div class="avatar-container">
            <img [src]="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid" alt="" class="avatar">
          </div>
        </ng-container>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      height: 70px;
      margin: 1.5rem 1.5rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      box-sizing: border-box;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 18px;
      box-shadow: var(--shadow-sm);
    }
    .search-bar {
      input {
        background: var(--bg-cream);
        border: 1px solid rgba(0,0,0,0.05);
        padding: 10px 20px;
        border-radius: 12px;
        width: 300px;
        font-family: inherit;
        font-size: 0.9rem;
        outline: none;
        transition: all 0.2s ease;
        &:focus { width: 350px; border-color: var(--primary-light); }
      }
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .theme-toggle, .notifications-icon {
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 12px;
      background: var(--bg-cream);
      transition: all 0.3s ease;
      &:hover { background: var(--primary); color: white; transform: translateY(-2px); }
    }
    .divider { width: 1px; height: 30px; background: rgba(0,0,0,0.08); margin: 0 0.5rem; }
    .info {
      display: flex;
      flex-direction: column;
      text-align: right;
      .name { font-weight: 700; font-size: 0.95rem; color: var(--primary); }
      .role { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; margin-top: 1px; }
    }
    .avatar-container {
      position: relative;
      &::after {
        content: ''; position: absolute; bottom: 2px; right: 2px;
        width: 10px; height: 10px; background: var(--success);
        border: 2px solid white; border-radius: 50%;
      }
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      object-fit: cover;
      border: 2px solid var(--bg-cream);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease;
      &:hover { transform: scale(1.05); }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
}
