import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { QRCodeData } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class QRService {
  private dataService = inject(DataService);

  generateUserQR(userId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/connect/${userId}`;
  }

  validateQR(userId: string, token: string): Promise<boolean> {
    // Logic to validate the token against Firestore
    return Promise.resolve(true);
  }
}
