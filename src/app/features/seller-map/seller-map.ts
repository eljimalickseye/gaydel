import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-page">
      <div class="header">
        <h2>Géolocalisation Temps Réel</h2>
        <div class="stats glass-card" *ngIf="sellersCount !== undefined">
          <span><strong>{{sellersCount}}</strong> Vendeurs actifs</span>
        </div>
      </div>
      
      <div id="map" class="glass-card"></div>
    </div>
  `,
  styles: [`
    .map-page { height: 100%; display: flex; flex-direction: column; gap: 20px; }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      h2 { margin: 0; color: var(--primary-color); }
    }
    .stats {
      padding: 10px 20px; display: flex; gap: 20px; font-size: 0.9rem;
      strong { color: var(--accent-color); }
    }
    #map { flex: 1; border-radius: 16px; overflow: hidden; min-height: 500px; z-index: 1; }
  `]
})
export class SellerMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataService = inject(DataService);
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private sub?: Subscription;
  sellersCount = 0;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.loadSellers();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [14.7167, -17.4677], // Dakar
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadSellers() {
    this.sub = this.dataService.getList<any>('users').subscribe(users => {
      const sellers = users.filter(u => u.role === 'SELLER');
      this.sellersCount = sellers.length;
      
      // Clear existing markers
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      sellers.forEach(seller => {
        // If seller doesn't have coordinates, use mock ones around Dakar for demo
        const lat = seller.latitude || (14.7167 + (Math.random() - 0.5) * 0.05);
        const lng = seller.longitude || (-17.4677 + (Math.random() - 0.5) * 0.05);

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #3e2723; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">☕</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(`
            <div style="font-family: 'Outfit', sans-serif; padding: 12px; min-width: 180px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div style="width: 32px; height: 32px; background: #4B3621; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">☕</div>
                <div>
                  <div style="color: #4B3621; font-weight: 800; font-size: 1rem;">${seller.displayName}</div>
                  <div style="color: #6B5D57; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Vendeur Certifié</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05);">
                <span style="font-size: 0.75rem; color: #2D6A4F; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  <span style="width: 6px; height: 6px; background: #2D6A4F; border-radius: 50%;"></span>
                  ACTIF
                </span>
                <span style="font-size: 0.75rem; color: #4B3621; font-weight: 600;">Dakar, SN</span>
              </div>
            </div>
          `);
        
        this.markers.push(marker);
      });
    });
  }
}
