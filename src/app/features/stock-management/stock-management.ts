import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../core/services/data.service';
import { Stock } from '../../core/models/app.models';
import { IconService } from '../../core/services/icon.service';
import { map } from 'rxjs';
import { StockDialogComponent } from './stock-dialog';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, AsyncPipe, MatDialogModule],
  template: `
    <div class="stock-page container-premium">
      <div class="header">
        <div class="title-area">
          <h2>Gestion des Stocks</h2>
          <p>Suivez l'inventaire de vos précieux grains de café.</p>
        </div>
        <button class="btn-premium primary shadow-btn" (click)="addItem()">
          <span [innerHTML]="iconService.getIcon('stock')" style="width: 20px; height: 20px;"></span>
          Ajouter du Stock
        </button>
      </div>

      <div class="stats-row" *ngIf="stats$ | async as s">
        <div class="stat-card glass-card">
          <span class="label">Total Inventaire</span>
          <span class="value">{{s.total}} kg</span>
        </div>
        <div class="stat-card glass-card warning" [class.active]="s.low > 0">
          <span class="label">Stock Faible</span>
          <span class="value">{{s.low}} Articles</span>
        </div>
        <div class="stat-card glass-card success">
          <span class="label">Statut Global</span>
          <span class="value">Optimal</span>
        </div>
      </div>

      <div class="table-container glass-card">
        <table mat-table [dataSource]="(stocks$ | async) || []">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Produit </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="product-cell">
                <div class="icon-circle" [innerHTML]="iconService.getIcon('coffee')"></div>
                <div class="name-meta">
                  <span class="p-name">{{element.name}}</span>
                  <span class="p-id">#{{element.id.substring(0, 8)}}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef> Quantité </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="qty-badge">{{element.quantity}} {{element.unit}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="warehouse">
            <th mat-header-cell *matHeaderCellDef> Entrepôt </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="warehouse-tag">{{element.warehouseName || 'Entrepôt Central'}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> État </th>
            <td mat-cell *matCellDef="let element">
              <span class="status-pill" [class.low]="element.quantity <= (element.minThreshold || 20)">
                {{element.quantity <= (element.minThreshold || 20) ? 'Faible' : 'En Stock'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> </th>
            <td mat-cell *matCellDef="let element">
              <div class="actions">
                <button class="icon-btn edit" (click)="editItem(element)"><mat-icon>edit</mat-icon></button>
                <button class="icon-btn delete" (click)="deleteItem(element)"><mat-icon>delete</mat-icon></button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .stock-page { height: 100%; display: flex; flex-direction: column; padding-bottom: 2rem; }
    .header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 2.5rem;
      h2 { margin: 0; }
      p { margin: 5px 0 0; color: var(--text-muted); font-size: 0.95rem; }
    }
    .stats-row {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      padding: 1.5rem; display: flex; flex-direction: column;
      .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
      .value { font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-top: 8px; }
      &.warning.active .value { color: var(--error); }
      &.success .value { color: var(--success); }
    }
    .table-container { padding: 0; overflow: hidden; border: 1px solid var(--glass-border); }
    table { width: 100%; background: transparent; }
    
    .product-cell {
      display: flex; align-items: center; gap: 1rem;
      .icon-circle { 
        width: 36px; height: 36px; background: var(--bg-cream); border-radius: 10px; 
        display: flex; align-items: center; justify-content: center; color: var(--primary);
        ::ng-deep svg { width: 20px; height: 20px; }
      }
      .name-meta {
        display: flex; flex-direction: column;
        .p-name { font-weight: 700; color: var(--primary); font-size: 0.95rem; }
        .p-id { font-size: 0.7rem; color: var(--text-muted); font-family: monospace; }
      }
    }
    .qty-badge { font-weight: 700; color: var(--text-main); }
    .warehouse-tag { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    
    .status-pill {
      padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
      background: #E8F5E9; color: #2D6A4F;
      &.low { background: #FFEBEE; color: #C62828; }
    }

    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      .icon-btn {
        width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent;
        color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        &:hover { background: var(--bg-cream); color: var(--primary); }
        &.delete:hover { color: var(--error); }
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
    }

    ::ng-deep .mat-mdc-header-row { background: rgba(75, 54, 33, 0.03); }
    ::ng-deep .mat-mdc-header-cell { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; border-bottom: 1px solid rgba(0,0,0,0.05); }
    ::ng-deep .mat-mdc-cell { border-bottom: 1px solid rgba(0,0,0,0.03); padding: 1rem 0; }
  `]
})
export class StockManagementComponent implements OnInit {
  dataService = inject(DataService);
  iconService = inject(IconService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'quantity', 'warehouse', 'status', 'actions'];
  
  stocks$ = this.dataService.getList<any>('stock', { sortField: 'createdAt', sortDirection: 'desc' });
  
  stats$ = this.stocks$.pipe(
    map(stocks => ({
      total: stocks.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
      low: stocks.filter(s => s.quantity <= (s.minThreshold || 20)).length
    }))
  );

  ngOnInit() {}

  async addItem() {
    const dialogRef = this.dialog.open(StockDialogComponent, {
      width: '450px',
      data: { title: 'Ajouter un nouveau stock' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.dataService.add('stock', result);
      }
    });
  }

  async editItem(item: any) {
    const dialogRef = this.dialog.open(StockDialogComponent, {
      width: '450px',
      data: { title: 'Modifier le stock', item }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.dataService.update('stock', item.id, result);
      }
    });
  }

  async deleteItem(item: any) {
    if (confirm(`Supprimer ${item.name} du stock ?`)) {
      await this.dataService.delete('stock', item.id);
    }
  }
}
