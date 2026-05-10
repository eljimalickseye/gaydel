import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../core/services/auth.service';
import { QRService } from '../../core/services/qr.service';

@Component({
  selector: 'app-my-qr',
  standalone: true,
  imports: [CommonModule, AsyncPipe, QRCodeComponent],
  template: `
    <div class="qr-page flex-center">
      @if (authService.user$ | async; as user) {
        <div class="qr-card glass-card">
          <h2>Mon QR Code Dynamique</h2>
          <p>Présentez ce code pour valider votre stock ou vos ventes.</p>
          
          <div class="qr-container">
            <qrcode 
              [qrdata]="qrData" 
              [width]="256" 
              [errorCorrectionLevel]="'M'"
              [colorDark]="'#3e2723'"
              [colorLight]="'#ffffff00'">
            </qrcode>
          </div>

          <div class="user-info">
            <span class="name">{{ user.displayName }}</span>
            <span class="id">ID: {{ user.uid.substring(0,8) }}</span>
          </div>

          <div class="status-badge active">
            <span class="dot"></span>
            Sécurisé & Actif
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .qr-page { height: 100%; padding: 40px; }
    .qr-card {
      padding: 40px;
      width: 400px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      h2 { margin: 0 0 10px; color: var(--primary-color); }
      p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 30px; }
    }
    .qr-container {
      background: white;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      margin-bottom: 30px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .name { font-weight: 800; font-size: 1.2rem; color: var(--primary-color); }
      .id { font-size: 0.8rem; color: var(--text-muted); }
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      &.active {
        background: #e8f5e9;
        color: #2e7d32;
        .dot { width: 8px; height: 8px; background: #2e7d32; border-radius: 50%; }
      }
    }
  `]
})
export class MyQRComponent implements OnInit {
  authService = inject(AuthService);
  qrService = inject(QRService);
  qrData = '';

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.qrData = this.qrService.generateUserQR(user.uid);
      }
    });
  }
}
