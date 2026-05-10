import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container glass-card">
      <div class="search-bar">
        <input type="text" placeholder="Rechercher...">
      </div>
      
      <div class="user-profile" *ngIf="authService.user$ | async as user">
        <div class="notifications-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="divider"></div>
        <div class="info">
          <span class="name">{{ user.displayName }}</span>
          <span class="role">{{ user.role }}</span>
        </div>
        <img [src]="user.photoURL || 'https://via.placeholder.com/40'" alt="Avatar" class="avatar">
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      height: 70px;
      margin: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .search-bar {
      input {
        background: rgba(0,0,0,0.05);
        border: none;
        padding: 10px 20px;
        border-radius: 12px;
        width: 300px;
        outline: none;
        &::placeholder { color: var(--text-muted); }
      }
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .divider { width: 1px; height: 30px; background: rgba(0,0,0,0.1); }
    .info {
      display: flex;
      flex-direction: column;
      text-align: right;
      .name { font-weight: 600; font-size: 0.9rem; }
      .role { font-size: 0.75rem; color: var(--text-muted); text-transform: lowercase; }
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .notifications-icon {
      color: var(--text-muted);
      cursor: pointer;
      &:hover { color: var(--primary-color); }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
}
