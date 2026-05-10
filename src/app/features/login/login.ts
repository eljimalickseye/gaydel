import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page coffee-gradient flex-center">
      <div class="login-card glass-card">
        <div class="header">
          <h1>GAYDEL</h1>
          <p>Gestion & Vente de Café Premium</p>
        </div>
        
        <div class="tabs">
          <button [class.active]="loginMethod === 'email'" (click)="loginMethod = 'email'">Email</button>
          <button [class.active]="loginMethod === 'phone'" (click)="loginMethod = 'phone'">Téléphone</button>
        </div>

        <form *ngIf="loginMethod === 'email'" (submit)="onLogin()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="votre@email.com" required>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="premium-btn coffee-gradient" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <form *ngIf="loginMethod === 'phone'" (submit)="onPhoneLogin()">
          <div class="form-group" *ngIf="!verificationSent">
            <label>Numéro de Téléphone</label>
            <input type="tel" [(ngModel)]="phone" name="phone" placeholder="+221 77 000 00 00" required>
          </div>
          <div class="form-group" *ngIf="verificationSent">
            <label>Code de Vérification</label>
            <input type="text" [(ngModel)]="code" name="code" placeholder="123456" required>
          </div>
          <button type="submit" class="premium-btn coffee-gradient" [disabled]="loading">
            {{ loading ? 'Chargement...' : (verificationSent ? 'Vérifier le code' : 'Envoyer SMS') }}
          </button>
          <div id="recaptcha-container"></div>
        </form>

        <div class="divider"><span>OU</span></div>

        <button (click)="onGoogleLogin()" class="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
          Continuer avec Google
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-page { width: 100vw; height: 100vh; }
    .login-card {
      width: 400px;
      padding: 40px;
      text-align: center;
      h1 { margin: 0; font-size: 2.5rem; letter-spacing: 4px; }
      p { color: rgba(255,255,255,0.7); margin-bottom: 30px; }
    }
    .tabs {
      display: flex; gap: 10px; margin-bottom: 20px;
      button {
        flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
        color: #fff; border-radius: 8px; cursor: pointer; transition: all 0.3s;
        &.active { background: var(--secondary-color); border-color: var(--secondary-color); font-weight: 700; }
      }
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      text-align: left;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label { font-size: 0.9rem; font-weight: 600; color: #fff; }
      input {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        outline: none;
        width: 100%;
        box-sizing: border-box;
        &::placeholder { color: rgba(255,255,255,0.4); }
      }
    }
    .premium-btn { margin-top: 10px; border: none; cursor: pointer; color: #fff; width: 100%; }
    .divider {
      margin: 30px 0;
      position: relative;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      span {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: #3e2723;
        padding: 0 10px;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.5);
      }
    }
    .google-btn {
      width: 100%;
      padding: 12px;
      background: #fff;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 600;
      cursor: pointer;
      color: #333;
      img { width: 20px; }
    }
  `]
})
export class LoginComponent {
  loginMethod: 'email' | 'phone' = 'email';
  email = '';
  password = '';
  phone = '';
  code = '';
  verificationSent = false;
  confirmationResult: any = null;
  loading = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin() {
    this.loading = true;
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e);
      alert('Erreur de connexion');
    } finally {
      this.loading = false;
    }
  }

  async onPhoneLogin() {
    this.loading = true;
    try {
      if (!this.verificationSent) {
        const verifier = this.authService.setupRecaptcha('recaptcha-container');
        this.confirmationResult = await this.authService.loginWithPhone(this.phone, verifier);
        this.verificationSent = true;
        alert('Code envoyé !');
      } else {
        await this.confirmationResult.confirm(this.code);
        this.router.navigate(['/dashboard']);
      }
    } catch (e) {
      console.error(e);
      alert('Erreur: ' + (e as any).message);
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e);
    }
  }
}
