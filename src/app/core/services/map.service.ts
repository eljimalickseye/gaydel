import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { UserLocation } from '../models/app.models';
import { where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private dataService = inject(DataService);

  getActiveSellers(): Observable<UserLocation[]> {
    return this.dataService.getList<UserLocation>('locations', where('isActive', '==', true));
  }

  updateLocation(userId: string, lat: number, lng: number, accuracy: number) {
    return this.dataService.update('locations', userId, {
      latitude: lat,
      longitude: lng,
      accuracy,
      timestamp: new Date(),
      isActive: true
    });
  }

  setInactive(userId: string) {
    return this.dataService.update('locations', userId, {
      isActive: false,
      timestamp: new Date()
    });
  }
}
