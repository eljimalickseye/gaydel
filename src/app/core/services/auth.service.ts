import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, switchMap, firstValueFrom, timeout, catchError } from 'rxjs';
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
        return this.getUserProfile(user.uid).pipe(
          timeout(5000),
          catchError(() => of({ 
            uid: user.uid, 
            email: user.email || '', 
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || '',
            role: 'SELLER' as any,
            status: 'active' as any,
            createdAt: new Date()
          }))
        );
      } else {
        return of(null);
      }
    })
  );

  async loginWithEmail(email: string, pass: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, pass);
    await this.handlePostLogin(credential.user);
    return credential;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.handlePostLogin(credential.user);
    return credential;
  }

  private async handlePostLogin(user: any) {
    try {
      // Use firstValueFrom with a timeout of 5s to avoid blocking the UI
      const profile = await firstValueFrom(
        this.getUserProfile(user.uid).pipe(
          timeout(5000),
          catchError(() => of(null))
        )
      );

      if (!profile) {
        const role = user.email === 'admin@gaydel.com' ? 'SUPER_ADMIN' : 'SELLER';
        await this.createUserProfile(user.uid, {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || (user.email === 'admin@gaydel.com' ? 'Administrateur' : 'User'),
          photoURL: user.photoURL || '',
          role: role as any,
          status: 'active',
          createdAt: new Date()
        });
      }
    } catch (e) {
      console.warn('Profile sync bypassed due to error or timeout:', e);
    }
  }

  setupRecaptcha(containerId: string): RecaptchaVerifier {
    return new RecaptchaVerifier(this.auth, containerId, {
      size: 'invisible'
    });
  }

  async loginWithPhone(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    return signInWithPhoneNumber(this.auth, phoneNumber, appVerifier);
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
