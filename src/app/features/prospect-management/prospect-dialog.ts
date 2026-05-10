import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prospect-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Nouveau Prospect</h2>
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Nom complet</mat-label>
            <input matInput [(ngModel)]="prospect.name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Entreprise</mat-label>
            <input matInput [(ngModel)]="prospect.company">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Téléphone</mat-label>
            <input matInput [(ngModel)]="prospect.phone" required>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Annuler</button>
        <button mat-raised-button class="coffee-gradient" [mat-dialog-close]="prospect">Enregistrer</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { min-width: 400px; padding: 10px; }
    .form-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
    .coffee-gradient { background: linear-gradient(135deg, #3e2723 0%, #1a0f0d 100%); color: white; }
  `]
})
export class ProspectDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  prospect = { name: '', company: '', phone: '', status: 'NEW' };
}
