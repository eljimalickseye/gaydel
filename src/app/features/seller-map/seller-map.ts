import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapService } from '../../core/services/map.service';

@Component({
  selector: 'app-seller-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-page">
      <div class="header">
        <h2>Géolocalisation Temps Réel</h2>
        <div class="stats glass-card">
          <span><strong>24</strong> Vendeurs actifs</span>
          <span><strong>150kg</strong> Stock total mobile</span>
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
export class SellerMapComponent implements OnInit, AfterViewInit {
  private mapService = inject(MapService);
  private map!: L.Map;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
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

    // Mock markers for now
    const mockSellers = [
      { name: 'Abdoulaye', lat: 14.7167, lng: -17.4677, stock: '12kg' },
      { name: 'Fatou', lat: 14.7300, lng: -17.4500, stock: '8kg' },
      { name: 'Moussa', lat: 14.7000, lng: -17.4800, stock: '15kg' }
    ];

    mockSellers.forEach(seller => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3e2723; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 2px solid white;">☕</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([seller.lat, seller.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-family: 'Outfit', sans-serif;">
            <strong style="color: #3e2723;">${seller.name}</strong><br>
            <span>Stock: ${seller.stock}</span><br>
            <span style="color: #2e7d32; font-weight: bold;">Statut: Actif</span>
          </div>
        `);
    });
  }
}
