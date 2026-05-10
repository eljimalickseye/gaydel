import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { HeaderComponent } from '../components/header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .main-content {
      flex: 1; display: flex; flex-direction: column; overflow: hidden;
      background: url('https://www.transparenttextures.com/patterns/cubes.png'), #fdfaf7;
    }
    .page-container {
      flex: 1; overflow-y: auto; padding: 10px 30px 30px 30px;
      scrollbar-width: thin; scrollbar-color: var(--primary-color) transparent;
    }
  `]
})
export class MainLayoutComponent {}
