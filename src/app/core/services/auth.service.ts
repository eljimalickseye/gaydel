import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { UserProfile, UserRole } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$: Observable<UserProfile | null> = authState(this.auth).pipe(
    switchMap(user => {
      if (user) {
        return this.getUserProfile(user.uid);
      } else {
        return of(null);
      }
    })
  );

  async loginWithEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const user = credential.user;
    
    // Check if profile exists, if not create as SELLER by default or handle accordingly
    const profile = await this.getUserProfile(user.uid).toPromise();
    if (!profile) {
      await this.createUserProfile(user.uid, {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || '',
        role: 'SELLER',
        status: 'pending',
        createdAt: new Date()
      });
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return new Observable(subscriber => {
      getDoc(userDoc).then(docSnap => {
        if (docSnap.exists()) {
          subscriber.next(docSnap.data() as UserProfile);
        } else {
          subscriber.next(null);
        }
        subscriber.complete();
      });
    });
  }

  async createUserProfile(uid: string, data: UserProfile) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return setDoc(userDoc, data);
  }
}
