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
        
        <form (submit)="onLogin()">
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
        &::placeholder { color: rgba(255,255,255,0.4); }
      }
    }
    .premium-btn { margin-top: 10px; border: none; cursor: pointer; color: #fff; }
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
  email = '';
  password = '';
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

  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e);
    }
  }
}
