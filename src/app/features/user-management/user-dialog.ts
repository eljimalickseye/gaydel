import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatStepperModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Ajouter un Utilisateur</h2>
      
      <mat-stepper #stepper class="custom-stepper">
        <!-- Step 1: Basic Info -->
        <mat-step [stepControl]="infoForm">
          <form [formGroup]="infoForm">
            <ng-template matStepLabel>Informations</ng-template>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nom complet</mat-label>
                <input matInput formControlName="displayName" placeholder="Prénom Nom">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Identifiant / Username</mat-label>
                <input matInput formControlName="username" placeholder="moussa.diop">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" placeholder="moussa@gaydel.com">
              </mat-form-field>
            </div>
            <div class="stepper-actions">
              <button mat-flat-button class="coffee-gradient" matStepperNext>Suivant</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Role Selection -->
        <mat-step>
          <ng-template matStepLabel>Rôle & Profil</ng-template>
          <div class="role-grid">
            <div class="role-card" 
                 *ngFor="let r of roles" 
                 [class.active]="selectedRole === r.id"
                 (click)="selectedRole = r.id">
              <div class="role-icon"><mat-icon>{{r.icon}}</mat-icon></div>
              <div class="role-info">
                <span class="role-name">{{r.label}}</span>
                <span class="role-desc">{{r.desc}}</span>
              </div>
            </div>
          </div>
          <div class="stepper-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-flat-button class="coffee-gradient" matStepperNext [disabled]="!selectedRole">Suivant</button>
          </div>
        </mat-step>

        <!-- Step 3: Confirmation -->
        <mat-step>
          <ng-template matStepLabel>Validation</ng-template>
          <div class="summary-card glass-card">
            <div class="summary-item">
              <label>Utilisateur :</label>
              <span>{{infoForm.value.displayName}} ({{infoForm.value.username}})</span>
            </div>
            <div class="summary-item">
              <label>Rôle attribué :</label>
              <span class="role-badge">{{getRoleLabel(selectedRole)}}</span>
            </div>
            <p class="warning-text">
              <mat-icon>info</mat-icon>
              Le compte sera créé dans Firestore. N'oubliez pas de l'ajouter dans la console Firebase Auth avec l'email <strong>{{infoForm.value.email}}</strong>.
            </p>
          </div>
          <div class="stepper-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-flat-button class="coffee-gradient" (click)="save()">Confirmer la création</button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .dialog-container { min-width: 500px; padding: 10px; }
    .form-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .custom-stepper { background: transparent; }
    .stepper-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    
    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
    .role-card {
      padding: 15px; border-radius: 12px; background: rgba(0,0,0,0.03);
      border: 2px solid transparent; cursor: pointer; transition: all 0.3s;
      display: flex; gap: 15px; align-items: center;
      &:hover { background: rgba(0,0,0,0.05); transform: translateY(-2px); }
      &.active { border-color: var(--secondary-color); background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    }
    .role-icon { width: 40px; height: 40px; border-radius: 10px; background: #efebe9; color: #3e2723; display: flex; align-items: center; justify-content: center; }
    .role-info { display: flex; flex-direction: column; }
    .role-name { font-weight: 700; font-size: 0.9rem; color: #3e2723; }
    .role-desc { font-size: 0.7rem; color: #777; }

    .summary-card { padding: 20px; margin-top: 20px; }
    .summary-item { display: flex; flex-direction: column; margin-bottom: 15px; label { font-size: 0.8rem; color: #777; } span { font-weight: 700; } }
    .role-badge { display: inline-block; padding: 4px 12px; background: #3e2723; color: #fff; border-radius: 20px; font-size: 0.8rem; width: fit-content; }
    .warning-text { display: flex; gap: 10px; font-size: 0.8rem; color: #856404; background: #fff3cd; padding: 10px; border-radius: 8px; margin-top: 20px; mat-icon { font-size: 18px; } }
  `]
})
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);

  infoForm = this.fb.group({
    displayName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  selectedRole = '';
  roles = [
    { id: 'SUPER_ADMIN', label: 'Administrateur', icon: 'security', desc: 'Accès total à la plateforme' },
    { id: 'STOCK_MANAGER', label: 'Gestionnaire Stock', icon: 'inventory_2', desc: 'Gestion des stocks et entrepôts' },
    { id: 'SALES_AGENT', label: 'Agent Commercial', icon: 'campaign', desc: 'Gestion des prospects et ventes' },
    { id: 'SELLER', label: 'Vendeur Terrain', icon: 'directions_run', desc: 'Application mobile et ventes terrain' }
  ];

  getRoleLabel(id: string) {
    return this.roles.find(r => r.id === id)?.label || id;
  }

  save() {
    if (this.infoForm.valid && this.selectedRole) {
      this.dialogRef.close({
        ...this.infoForm.value,
        role: this.selectedRole,
        status: 'active'
      });
    }
  }
}
