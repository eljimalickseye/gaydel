import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../core/services/data.service';
import { map, Observable } from 'rxjs';
import { IconService } from '../../core/services/icon.service';
import { ProspectDialogComponent } from './prospect-dialog';

@Component({
  selector: 'app-prospect-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, AsyncPipe, MatDialogModule],
  template: `
    <div class="prospects-page">
      <div class="header">
        <div class="title-area">
          <h2>Pipeline Commercial</h2>
          <p>Gérez vos prospects et convertissez-les en clients fidèles.</p>
        </div>
        <button class="premium-btn coffee-gradient flex-center" (click)="addProspect()">
          <mat-icon>person_add</mat-icon> Nouveau Prospect
        </button>
      </div>

      <div class="pipeline-container" *ngIf="prospects$ | async as prospects">
        <div class="pipeline-column" *ngFor="let col of columnDefs">
          <div class="column-header">
            <h3>{{col.label}}</h3>
            <span class="count">{{getProspectsByStatus(prospects, col.id).length}}</span>
          </div>
          
          <div class="column-content">
            <mat-card class="prospect-card glass-card" *ngFor="let p of getProspectsByStatus(prospects, col.id)">
              <mat-card-header>
                <div mat-card-avatar class="avatar">{{p.name.charAt(0)}}</div>
                <mat-card-title>{{p.name}}</mat-card-title>
                <mat-card-subtitle>{{p.company}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="info">
                  <div class="item">
                    <mat-icon>phone</mat-icon> <span>{{p.phone}}</span>
                  </div>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-icon-button color="warn" (click)="deleteProspect(p)"><mat-icon>delete</mat-icon></button>
                <div class="spacer"></div>
                <button mat-icon-button (click)="moveProspect(p, 'prev')" [disabled]="col.id === 'NEW'"><mat-icon>arrow_back</mat-icon></button>
                <button mat-icon-button (click)="moveProspect(p, 'next')" [disabled]="col.id === 'CONVERTED'"><mat-icon>arrow_forward</mat-icon></button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prospects-page { padding-top: 10px; height: 100%; display: flex; flex-direction: column; }
    .header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 30px;
      h2 { margin: 0; color: var(--primary-color); font-weight: 800; }
      p { margin: 5px 0 0; color: var(--text-muted); }
    }
    .pipeline-container {
      flex: 1;
      display: flex; gap: 20px;
      overflow-x: auto;
      padding-bottom: 20px;
    }
    .pipeline-column {
      min-width: 320px; width: 320px;
      display: flex; flex-direction: column;
      gap: 15px;
    }
    .column-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px;
      h3 { margin: 0; font-size: 1rem; color: var(--primary-color); font-weight: 700; }
      .count { 
        background: rgba(62, 39, 35, 0.1); color: var(--primary-color); 
        padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 800;
      }
    }
    .column-content {
      flex: 1; background: rgba(0,0,0,0.02); border-radius: 16px; padding: 10px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .prospect-card {
      border: none; border-radius: 12px;
      .avatar { 
        background: var(--secondary-color); color: #fff; 
        display: flex; align-items: center; justify-content: center; 
        font-weight: 800; border-radius: 50%; width: 40px; height: 40px;
      }
      mat-card-title { font-size: 0.95rem; font-weight: 700; }
      mat-card-subtitle { font-size: 0.8rem; }
      .info {
        margin-top: 10px; display: flex; flex-direction: column; gap: 5px;
        .item { 
          display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted);
          mat-icon { font-size: 16px; width: 16px; height: 16px; }
        }
      }
    }
  `]
})
export class ProspectManagementComponent implements OnInit {
  private dataService = inject(DataService);
  iconService = inject(IconService);
  dialog = inject(MatDialog);

  prospects$ = this.dataService.getList<any>('prospects', { sortField: 'createdAt', sortDirection: 'desc' });

  columnDefs = [
    { id: 'NEW', label: 'Nouveau' },
    { id: 'CONTACTED', label: 'Contacté' },
    { id: 'QUALIFIED', label: 'Qualifié' },
    { id: 'CONVERTED', label: 'Converti' }
  ];

  ngOnInit() {}

  getProspectsByStatus(prospects: any[], status: string) {
    return prospects.filter(p => p.status === status);
  }

  async addProspect() {
    const dialogRef = this.dialog.open(ProspectDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.dataService.add('prospects', {
          ...result,
          createdAt: new Date()
        });
      }
    });
  }

  async moveProspect(prospect: any, direction: 'next' | 'prev') {
    const currentIndex = this.columnDefs.findIndex(c => c.id === prospect.status);
    let newIndex = currentIndex;

    if (direction === 'next' && currentIndex < this.columnDefs.length - 1) {
      newIndex++;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex--;
    }

    if (newIndex !== currentIndex) {
      await this.dataService.update('prospects', prospect.id, { 
        status: this.columnDefs[newIndex].id 
      });
    }
  }

  async deleteProspect(prospect: any) {
    if (confirm(`Supprimer le prospect ${prospect.name} ?`)) {
      await this.dataService.delete('prospects', prospect.id);
    }
  }
}
