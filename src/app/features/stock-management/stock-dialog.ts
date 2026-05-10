import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{data.title}}</h2>
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Nom du produit</mat-label>
            <input matInput [(ngModel)]="stock.name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Catégorie</mat-label>
            <mat-select [(ngModel)]="stock.category">
              <mat-option value="Café">Café</mat-option>
              <mat-option value="Machine">Machine</mat-option>
              <mat-option value="Accessoire">Accessoire</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Quantité</mat-label>
            <input matInput type="number" [(ngModel)]="stock.quantity">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Seuil minimal</mat-label>
            <input matInput type="number" [(ngModel)]="stock.minThreshold">
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Annuler</button>
        <button mat-raised-button class="coffee-gradient text-white" [mat-dialog-close]="stock">Enregistrer</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { min-width: 400px; padding: 10px; }
    .form-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
    .coffee-gradient { background: linear-gradient(135deg, #3e2723 0%, #1a0f0d 100%); color: white; }
  `]
})
export class StockDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  stock = { name: '', category: 'Café', quantity: 0, minThreshold: 20, ...this.data.item };
}
