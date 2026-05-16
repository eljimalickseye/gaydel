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
    <div class="prospects-page container-premium">
      <div class="header">
        <div class="title-area">
          <h2>Pipeline Commercial</h2>
          <p>Convertissez vos prospects en ambassadeurs GAYDEL.</p>
        </div>
        <button class="btn-premium primary shadow-btn" (click)="addProspect()">
          <span [innerHTML]="iconService.getIcon('users')" style="width: 20px; height: 20px;"></span>
          Nouveau Prospect
        </button>
      </div>

      <div class="pipeline-container" *ngIf="prospects$ | async as prospects">
        <div class="pipeline-column" *ngFor="let col of columnDefs">
          <div class="column-header">
            <h3>{{col.label}}</h3>
            <span class="count">{{getProspectsByStatus(prospects, col.id).length}}</span>
          </div>
          
          <div class="column-content">
            <div class="prospect-card glass-card" *ngFor="let p of getProspectsByStatus(prospects, col.id)">
              <div class="card-header">
                <div class="avatar">{{p.name.charAt(0)}}</div>
                <div class="meta">
                  <span class="name">{{p.name}}</span>
                  <span class="company">{{p.company || 'Indépendant'}}</span>
                </div>
              </div>
              
              <div class="card-body">
                <div class="info-item">
                  <span [innerHTML]="iconService.getIcon('location')" style="width: 14px; height: 14px;"></span>
                  <span>{{p.phone}}</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="action-btn delete" (click)="deleteProspect(p)">
                  <mat-icon style="font-size: 18px;">delete</mat-icon>
                </button>
                <div class="nav-actions">
                  <button class="action-btn" (click)="moveProspect(p, 'prev')" [disabled]="col.id === 'NEW'">
                    <mat-icon>chevron_left</mat-icon>
                  </button>
                  <button class="action-btn" (click)="moveProspect(p, 'next')" [disabled]="col.id === 'CONVERTED'">
                    <mat-icon>chevron_right</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prospects-page { height: 100%; display: flex; flex-direction: column; padding-bottom: 2rem; }
    .header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 2.5rem;
      h2 { margin: 0; }
      p { margin: 5px 0 0; color: var(--text-muted); font-size: 0.95rem; }
    }
    .pipeline-container {
      flex: 1; display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem;
      scrollbar-width: thin;
    }
    .pipeline-column {
      min-width: 300px; width: 300px; display: flex; flex-direction: column; gap: 1.2rem;
    }
    .column-header {
      display: flex; justify-content: space-between; align-items: center; padding: 0 0.5rem;
      h3 { margin: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
      .count { 
        background: var(--primary); color: white; padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
      }
    }
    .column-content {
      flex: 1; background: rgba(75, 54, 33, 0.02); border-radius: 24px; padding: 1rem;
      display: flex; flex-direction: column; gap: 1rem; border: 1px dashed rgba(75, 54, 33, 0.1);
    }
    .prospect-card {
      padding: 1.2rem; border-radius: 18px; border: 1px solid rgba(255,255,255,0.5);
      .card-header {
        display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;
        .avatar { 
          width: 38px; height: 38px; background: var(--primary-light); color: white;
          display: flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: 700;
        }
        .meta {
          display: flex; flex-direction: column;
          .name { font-weight: 700; font-size: 0.95rem; color: var(--primary); }
          .company { font-size: 0.75rem; color: var(--text-muted); }
        }
      }
      .card-body {
        .info-item {
          display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted);
          span { font-weight: 500; }
        }
      }
      .card-actions {
        margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.05);
        display: flex; justify-content: space-between; align-items: center;
        .action-btn {
          width: 32px; height: 32px; border-radius: 10px; border: none; background: var(--bg-cream);
          color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          &:hover:not(:disabled) { background: var(--primary); color: white; }
          &:disabled { opacity: 0.3; cursor: not-allowed; }
          &.delete:hover { background: var(--error); color: white; }
          mat-icon { font-size: 18px; width: 18px; height: 18px; }
        }
        .nav-actions { display: flex; gap: 8px; }
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
