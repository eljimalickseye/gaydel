import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '../../core/services/icon.service';
import { AuthService } from '../../core/services/auth.service';
import { QRService } from '../../core/services/qr.service';

@Component({
  selector: 'app-my-qr',
  standalone: true,
  imports: [CommonModule, AsyncPipe, QRCodeComponent, MatButtonModule, MatIconModule],
  template: `
    <div class="qr-page flex-center">
      @if (authService.user$ | async; as user) {
        <div class="card-wrapper">
          <div class="qr-card glass-card" id="qr-card">
            <div class="card-header">
              <div class="logo-box coffee-gradient">
                <span [innerHTML]="iconService.getIcon('coffee')"></span>
              </div>
              <div class="brand">
                <h3>GAYDEL</h3>
                <span>Premium Coffee Experience</span>
              </div>
            </div>

            <div class="qr-main">
              <div class="qr-frame">
                <qrcode 
                  [qrdata]="qrData" 
                  [width]="220" 
                  [errorCorrectionLevel]="'M'"
                  [colorDark]="'#3e2723'"
                  [colorLight]="'#ffffff00'">
                </qrcode>
              </div>
            </div>

            <div class="card-footer">
              <div class="user-meta">
                <span class="name">{{ user.displayName }}</span>
                <span class="role">{{ user.role }}</span>
              </div>
              <div class="status-indicator">
                <span class="dot"></span> Vérifié
              </div>
            </div>
          </div>

          <div class="actions-bar">
            <button mat-flat-button class="coffee-gradient premium-btn" (click)="downloadQR()">
              <mat-icon>download</mat-icon> Enregistrer
            </button>
            <button mat-stroked-button class="premium-btn" (click)="shareProfile()">
              <mat-icon>share</mat-icon> Partager
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .qr-page { height: 100%; padding: 20px; }
    .card-wrapper { display: flex; flex-direction: column; gap: 30px; align-items: center; width: 100%; max-width: 400px; }
    
    .qr-card {
      width: 100%;
      padding: 30px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 25px;
      background: linear-gradient(165deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%);
      
      &::before {
        content: ''; position: absolute; top: -50px; right: -50px;
        width: 150px; height: 150px; background: var(--primary-color);
        opacity: 0.03; border-radius: 50%;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 15px;
      .logo-box {
        width: 45px; height: 45px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        ::ng-deep svg { width: 24px; height: 24px; fill: white; }
      }
      .brand {
        display: flex; flex-direction: column;
        h3 { margin: 0; font-size: 1.1rem; letter-spacing: 2px; font-weight: 800; color: var(--primary-color); }
        span { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
      }
    }

    .qr-main {
      display: flex; justify-content: center; padding: 10px 0;
      .qr-frame {
        background: white; padding: 15px; border-radius: 24px;
        box-shadow: 0 15px 35px rgba(62, 39, 35, 0.1);
        border: 1px solid rgba(0,0,0,0.05);
      }
    }

    .card-footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      .user-meta {
        display: flex; flex-direction: column;
        .name { font-weight: 800; font-size: 1.1rem; color: var(--primary-color); }
        .role { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
      }
      .status-indicator {
        display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 700; color: #2e7d32;
        padding: 4px 10px; background: #e8f5e9; border-radius: 20px;
        .dot { width: 6px; height: 6px; background: #2e7d32; border-radius: 50%; }
      }
    }

    .actions-bar {
      display: flex; gap: 15px; width: 100%;
      button { flex: 1; height: 50px; }
    }
  `]
})
export class MyQRComponent implements OnInit {
  authService = inject(AuthService);
  qrService = inject(QRService);
  iconService = inject(IconService);
  qrData = '';

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.qrData = this.qrService.generateUserQR(user.uid);
      }
    });
  }

  downloadQR() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `gaydel-qr-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  shareProfile() {
    if (navigator.share) {
      navigator.share({
        title: 'Mon Profil GAYDEL',
        text: 'Scannez mon code pour voir mon profil premium GAYDEL.',
        url: this.qrData
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(this.qrData);
      alert('Lien copié dans le presse-papier !');
    }
  }
}
