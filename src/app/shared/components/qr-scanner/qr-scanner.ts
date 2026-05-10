import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="scanner-container glass-card">
      <div class="viewfinder">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="scan-line"></div>
        <div class="mock-video">
          <mat-icon>videocam_off</mat-icon>
          <span>Caméra inactive (Simulation)</span>
        </div>
      </div>
      
      <div class="controls">
        <p>Alignez le QR Code dans le cadre pour scanner</p>
        <button mat-flat-button color="primary" (click)="simulateScan()">
          Simuler un Scan
        </button>
      </div>
    </div>
  `,
  styles: [`
    .scanner-container {
      padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 20px;
      max-width: 400px; margin: 0 auto;
    }
    .viewfinder {
      width: 250px; height: 250px; position: relative;
      background: #000; border-radius: 20px; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .mock-video {
      color: rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; gap: 10px;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      span { font-size: 0.8rem; }
    }
    .corner {
      position: absolute; width: 30px; height: 30px; border: 4px solid var(--accent-color);
      &.top-left { top: 15px; left: 15px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
      &.top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
      &.bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
      &.bottom-right { bottom: 15px; right: 15px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
    }
    .scan-line {
      position: absolute; top: 0; left: 0; width: 100%; height: 2px;
      background: var(--accent-color); box-shadow: 0 0 15px var(--accent-color);
      animation: scan 3s infinite linear;
    }
    @keyframes scan {
      0% { top: 10%; }
      50% { top: 90%; }
      100% { top: 10%; }
    }
    .controls { text-align: center; p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px; } }
  `]
})
export class QRScannerComponent {
  @Output() scan = new EventEmitter<string>();

  simulateScan() {
    this.scan.emit('GAYDEL_SCAN_SUCCESS_TOKEN_123');
  }
}
