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
    <div class="qr-page container-premium flex-center">
      @if (authService.user$ | async; as user) {
        <div class="card-wrapper">
          <div class="qr-card glass-card" id="qr-card">
            <div class="card-header">
              <div class="logo-box">
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
                  [width]="200" 
                  [errorCorrectionLevel]="'M'"
                  [colorDark]="'#4B3621'"
                  [colorLight]="'#ffffff00'">
                </qrcode>
              </div>
            </div>

            <div class="card-footer">
              <div class="user-meta">
                <span class="name">{{ user.displayName }}</span>
                <span class="role">{{ user.role.replace('_', ' ') }}</span>
              </div>
              <div class="status-indicator">
                <span class="dot"></span> ID VÉRIFIÉ
              </div>
            </div>
          </div>

          <div class="actions-bar">
            <button class="btn-premium primary shadow-btn" (click)="downloadQR()">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">download</mat-icon> 
              Télécharger
            </button>
            <button class="btn-premium accent shadow-btn" (click)="shareProfile()">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">share</mat-icon> 
              Partager
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .qr-page { height: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 3rem; }
    .card-wrapper { display: flex; flex-direction: column; gap: 2rem; align-items: center; width: 100%; max-width: 380px; }
    
    .qr-card {
      width: 100%; padding: 2rem; position: relative; overflow: hidden;
      display: flex; flex-direction: column; gap: 2rem;
      background: linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
      border: 1px solid rgba(255,255,255,0.6);
      
      &::before {
        content: ''; position: absolute; top: -40px; right: -40px;
        width: 120px; height: 120px; background: var(--primary);
        opacity: 0.05; border-radius: 50%;
      }
    }

    .card-header {
      display: flex; align-items: center; gap: 1rem;
      .logo-box {
        width: 44px; height: 44px; border-radius: 12px; background: var(--primary);
        display: flex; align-items: center; justify-content: center;
        ::ng-deep svg { width: 22px; height: 22px; color: white; }
      }
      .brand {
        display: flex; flex-direction: column;
        h3 { margin: 0; font-size: 1.1rem; letter-spacing: 2px; font-weight: 800; color: var(--primary); }
        span { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
      }
    }

    .qr-main {
      display: flex; justify-content: center;
      .qr-frame {
        background: white; padding: 1rem; border-radius: 20px;
        box-shadow: 0 10px 30px rgba(75, 54, 33, 0.08);
        border: 1px solid rgba(0,0,0,0.03);
      }
    }

    .card-footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      .user-meta {
        display: flex; flex-direction: column;
        .name { font-weight: 800; font-size: 1.1rem; color: var(--primary); }
        .role { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
      }
      .status-indicator {
        display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 800; color: var(--success);
        padding: 5px 12px; background: rgba(45, 106, 79, 0.08); border-radius: 20px;
        .dot { width: 6px; height: 6px; background: var(--success); border-radius: 50%; box-shadow: 0 0 5px var(--success); }
      }
    }

    .actions-bar {
      display: flex; gap: 1rem; width: 100%;
      button { flex: 1; height: 50px; font-size: 0.9rem; }
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
