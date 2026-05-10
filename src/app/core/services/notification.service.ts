import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './data.service';
import { Observable, filter } from 'rxjs';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: any;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private dataService = inject(DataService);

  getNotifications(userId: string): Observable<AppNotification[]> {
    return this.dataService.getList<AppNotification>('notifications');
  }

  notify(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snack-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  async createNotification(userId: string, notification: Partial<AppNotification>) {
    return this.dataService.add('notifications', {
      ...notification,
      userId,
      read: false,
      timestamp: new Date()
    });
  }
}
