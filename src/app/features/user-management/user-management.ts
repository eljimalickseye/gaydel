import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../core/services/data.service';
import { UserProfile } from '../../core/models/app.models';
import { AuthService } from '../../core/services/auth.service';
import { UserDialogComponent } from './user-dialog';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, AsyncPipe, MatDialogModule],
  template: `
    <div class="users-page">
      <div class="header">
        <div class="title-area">
          <h2>Gestion des Utilisateurs</h2>
          <p>Administrez les accès et les rôles de la plateforme GAYDEL.</p>
        </div>
        <button class="premium-btn coffee-gradient flex-center" (click)="addUser()">
          <mat-icon>person_add</mat-icon> Ajouter un Utilisateur
        </button>
      </div>

      <div class="table-container glass-card">
        <table mat-table [dataSource]="(users$ | async) || []" class="mat-elevation-z0">
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef> Utilisateur </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="user-cell">
                <img [src]="element.photoURL || 'https://via.placeholder.com/40'" alt="Avatar">
                <div class="info">
                  <span class="name">{{element.displayName}}</span>
                  <span class="email">{{element.email}}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef> Rôle </th>
            <td mat-cell *matCellDef="let element">
              <mat-chip-listbox>
                <mat-chip class="role-chip" [ngClass]="element.role?.toLowerCase() || ''">
                  {{element.role}}
                </mat-chip>
              </mat-chip-listbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Statut </th>
            <td mat-cell *matCellDef="let element">
              <span class="status-dot" [ngClass]="element.status"></span>
              {{element.status === 'active' ? 'Actif' : 'En attente'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary"><mat-icon>security</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteUser(element)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-page { padding-top: 10px; }
    .header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 30px;
      h2 { margin: 0; color: var(--primary-color); font-weight: 800; }
      p { margin: 5px 0 0; color: var(--text-muted); }
    }
    .table-container { padding: 10px; overflow: hidden; }
    table { width: 100%; background: transparent; }
    .user-cell {
      display: flex; align-items: center; gap: 12px;
      img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
      .info {
        display: flex; flex-direction: column;
        .name { font-weight: 600; font-size: 0.9rem; }
        .email { font-size: 0.75rem; color: var(--text-muted); }
      }
    }
    .role-chip {
      font-size: 0.7rem; font-weight: 700;
      &.super_admin { background: #efebe9; color: #5d4037; }
      &.stock_manager { background: #e3f2fd; color: #1976d2; }
      &.sales_agent { background: #fdf5e6; color: #8d6e63; }
      &.seller { background: #e8f5e9; color: #2e7d32; }
    }
    .status-dot {
      display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;
      &.active { background: #2e7d32; }
      &.pending { background: #ffa000; }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['user', 'role', 'status', 'actions'];
  users$ = this.dataService.getList<UserProfile>('users');

  ngOnInit() {}

  async addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.dataService.add('users', {
            ...result,
            createdAt: new Date()
          });
          alert(`Profil pour ${result.displayName} créé !`);
        } catch (e) {
          alert('Erreur lors de la création');
        }
      }
    });
  }

  async deleteUser(user: any) {
    if (confirm(`Supprimer le profil de ${user.displayName} ?`)) {
      await this.dataService.delete('users', user.id);
    }
  }
}
