import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../core/services/data.service';
import { Stock } from '../../core/models/app.models';
import { IconService } from '../../core/services/icon.service';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="stock-page">
      <div class="header">
        <div class="title-area">
          <h2>Gestion des Stocks</h2>
          <p>Suivez et gérez votre inventaire de café en temps réel.</p>
        </div>
        <button class="premium-btn coffee-gradient flex-center">
          <mat-icon>add</mat-icon> Ajouter du Stock
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-card glass-card">
          <span class="label">Total Inventaire</span>
          <span class="value">450 kg</span>
        </div>
        <div class="stat-card glass-card warning">
          <span class="label">Stock Faible</span>
          <span class="value">3 Articles</span>
        </div>
        <div class="stat-card glass-card success">
          <span class="label">Entrées du jour</span>
          <span class="value">+25 kg</span>
        </div>
      </div>

      <div class="table-container glass-card">
        <table mat-table [dataSource]="stocks" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Produit </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="product-cell">
                <div class="icon" [innerHTML]="iconService.getIcon('coffee')"></div>
                <span>{{element.name}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef> Quantité </th>
            <td mat-cell *matCellDef="let element"> {{element.quantity}} {{element.unit}} </td>
          </ng-container>

          <ng-container matColumnDef="warehouse">
            <th mat-header-cell *matHeaderCellDef> Entrepôt </th>
            <td mat-cell *matCellDef="let element"> {{element.warehouseName}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Statut </th>
            <td mat-cell *matCellDef="let element">
              <mat-chip-listbox>
                <mat-chip [color]="element.quantity <= element.minThreshold ? 'warn' : 'primary'" selected>
                  {{element.quantity <= element.minThreshold ? 'Faible' : 'Optimale'}}
                </mat-chip>
              </mat-chip-listbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .stock-page { padding-top: 10px; }
    .header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 30px;
      h2 { margin: 0; color: var(--primary-color); font-weight: 800; }
      p { margin: 5px 0 0; color: var(--text-muted); }
    }
    .stats-row {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      padding: 20px; display: flex; flex-direction: column;
      .label { font-size: 0.85rem; color: var(--text-muted); }
      .value { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); margin-top: 5px; }
      &.warning .value { color: #c62828; }
      &.success .value { color: #2e7d32; }
    }
    .table-container { padding: 10px; overflow: hidden; }
    table { width: 100%; background: transparent; }
    .product-cell {
      display: flex; align-items: center; gap: 12px;
      .icon { width: 24px; height: 24px; color: var(--primary-color); }
      span { font-weight: 600; }
    }
    ::ng-deep .mat-mdc-header-row { background: rgba(0,0,0,0.02); }
    ::ng-deep .mat-mdc-cell { color: var(--text-color); }
  `]
})
export class StockManagementComponent implements OnInit {
  dataService = inject(DataService);
  iconService = inject(IconService);

  displayedColumns: string[] = ['name', 'quantity', 'warehouse', 'status', 'actions'];
  stocks: any[] = [
    { name: 'Café Arabica - Grains', quantity: 120, unit: 'kg', warehouseName: 'Entrepôt Central', minThreshold: 50 },
    { name: 'Café Robusta - Moulu', quantity: 15, unit: 'kg', warehouseName: 'Dakar Nord', minThreshold: 30 },
    { name: 'Capsules Espresso Gold', quantity: 500, unit: 'pcs', warehouseName: 'Entrepôt Central', minThreshold: 100 },
    { name: 'Café Bio - Vert', quantity: 10, unit: 'kg', warehouseName: 'Saint-Louis', minThreshold: 20 }
  ];

  ngOnInit() {}
}
