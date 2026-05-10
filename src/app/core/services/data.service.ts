import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  getList<T>(path: string, options?: { filterField?: string, filterValue?: any, sortField?: string, sortDirection?: 'asc' | 'desc' }): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    let constraints: any[] = [];

    if (options?.filterField) {
      constraints.push(where(options.filterField, '==', options.filterValue));
    }
    
    if (options?.sortField) {
      constraints.push(orderBy(options.sortField, options.sortDirection || 'asc'));
    }
    
    const q = query(colRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getDoc<T>(path: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<T>;
  }

  add(path: string, data: any) {
    const colRef = collection(this.firestore, path);
    return addDoc(colRef, { ...data, createdAt: new Date() });
  }

  update(path: string, id: string, data: any) {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return updateDoc(docRef, { ...data, updatedAt: new Date() });
  }

  delete(path: string, id: string) {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(docRef);
  }
}
