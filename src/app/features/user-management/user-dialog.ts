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

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email (Optionnel)</mat-label>
                  <input matInput formControlName="email" placeholder="moussa@gaydel.com">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Téléphone (WhatsApp)</mat-label>
                  <input matInput formControlName="phone" placeholder="221770000000">
                </mat-form-field>
              </div>
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
          <ng-template matStepLabel>Accès</ng-template>
          <div class="credentials-card">
            <div class="header-c">
              <mat-icon>verified_user</mat-icon>
              <h3>Identifiants Générés</h3>
            </div>
            
            <div class="cred-row">
              <div class="item">
                <label>Identifiant</label>
                <div class="value-box">{{infoForm.value.username}}</div>
              </div>
              <div class="item">
                <label>Mot de passe</label>
                <div class="value-box highlight">{{generatedPassword}}</div>
              </div>
            </div>

            <div class="action-buttons">
              <button mat-stroked-button (click)="copyCredentials()">
                <mat-icon>content_copy</mat-icon> Copier
              </button>
              <button mat-stroked-button color="primary" (click)="shareWhatsApp()" [disabled]="!infoForm.value.phone">
                <mat-icon>chat</mat-icon> WhatsApp
              </button>
            </div>
          </div>

          <div class="stepper-actions">
            <button mat-button matStepperPrevious>Retour</button>
            <button mat-flat-button class="coffee-gradient" (click)="save()">Terminer & Enregistrer</button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .dialog-container { min-width: 500px; padding: 10px; }
    .form-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
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

    .credentials-card { 
      background: #fdf5e6; border: 1px dashed #d7b377; border-radius: 16px; padding: 25px; margin-top: 20px;
      .header-c { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #3e2723; h3 { margin: 0; } }
      .cred-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
      .item label { display: block; font-size: 0.75rem; color: #8d6e63; margin-bottom: 5px; text-transform: uppercase; font-weight: 800; }
      .value-box { background: #fff; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 1.1rem; border: 1px solid #efebe9; }
      .value-box.highlight { color: #3e2723; font-weight: 800; letter-spacing: 2px; }
      .action-buttons { display: flex; gap: 10px; }
    }
  `]
})
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);

  infoForm = this.fb.group({
    displayName: ['', Validators.required],
    username: ['', Validators.required],
    email: [''], // Optional
    phone: ['']  // Added for WhatsApp
  });

  selectedRole = '';
  generatedPassword = this.generatePass();
  
  roles = [
    { id: 'SUPER_ADMIN', label: 'Administrateur', icon: 'security', desc: 'Accès total à la plateforme' },
    { id: 'STOCK_MANAGER', label: 'Gestionnaire Stock', icon: 'inventory_2', desc: 'Gestion des stocks et entrepôts' },
    { id: 'SALES_AGENT', label: 'Agent Commercial', icon: 'campaign', desc: 'Gestion des prospects et ventes' },
    { id: 'SELLER', label: 'Vendeur Terrain', icon: 'directions_run', desc: 'Application mobile et ventes terrain' }
  ];

  generatePass() {
    return Math.random().toString(36).slice(-8).toUpperCase();
  }

  getRoleLabel(id: string) {
    return this.roles.find(r => r.id === id)?.label || id;
  }

  copyCredentials() {
    const text = `Accès GAYDEL\nIdentifiant: ${this.infoForm.value.username}\nMot de passe: ${this.generatedPassword}\nURL: https://gaydel-907f1.web.app`;
    navigator.clipboard.writeText(text);
    alert('Identifiants copiés !');
  }

  shareWhatsApp() {
    const text = `Bienvenue chez GAYDEL ! ☕\n\nVoici tes accès :\n👤 Identifiant : ${this.infoForm.value.username}\n🔑 Mot de passe : ${this.generatedPassword}\n\nLien : https://gaydel-907f1.web.app`;
    const phone = this.infoForm.value.phone?.replace(/\s/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }

  save() {
    if (this.infoForm.valid && this.selectedRole) {
      this.dialogRef.close({
        ...this.infoForm.value,
        role: this.selectedRole,
        tempPassword: this.generatedPassword,
        status: 'active'
      });
    }
  }
}
