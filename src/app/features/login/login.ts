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
    <div class="login-page flex-center">
      <div class="bg-overlay"></div>
      <div class="login-card glass-card fade-in">
        <div class="logo-area">
          <div class="coffee-icon" [innerHTML]="iconService.getIcon('coffee')"></div>
          <h1>GAYDEL</h1>
          <div class="separator"></div>
          <p>L'excellence du café premium</p>
        </div>

        <form (submit)="onLogin()">
          <div class="form-group">
            <label>Identifiant</label>
            <div class="input-wrapper">
              <input type="text" [(ngModel)]="username" name="username" placeholder="votre@email.com" required>
            </div>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <div class="input-wrapper">
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
            </div>
          </div>
          <button type="submit" class="premium-btn primary shadow-btn" [disabled]="loading" style="width: 100%; justify-content: center;">
            {{ loading ? 'CONNEXION...' : 'SE CONNECTER' }}
          </button>
        </form>

        <div class="divider"><span>OU</span></div>

        <button (click)="onGoogleLogin()" class="google-btn glass-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
          Google Account
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-page { 
      width: 100vw; height: 100vh; position: relative;
      background: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
      display: flex; align-items: center; justify-content: center;
    }
    .bg-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, rgba(44, 24, 16, 0.9), rgba(0, 0, 0, 0.7));
    }
    .login-card {
      width: 420px; padding: 40px; text-align: center; position: relative; z-index: 10;
      border: 1px solid rgba(255,255,255,0.15); border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .logo-area {
      margin-bottom: 35px;
      .coffee-icon { 
        width: 60px; height: 60px; margin: 0 auto 15px; color: var(--accent);
        filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4)); 
      }
      h1 { margin: 0; font-size: 2.2rem; letter-spacing: 6px; color: #fff; font-weight: 800; }
      .separator { width: 40px; height: 2px; background: var(--accent); margin: 12px auto; border-radius: 1px; }
      p { color: rgba(255,255,255,0.6); font-size: 0.8rem; letter-spacing: 1.5px; text-transform: uppercase; }
    }
    .form-group {
      margin-bottom: 20px; text-align: left;
      label { font-size: 0.7rem; font-weight: 700; color: var(--accent); text-transform: uppercase; margin-bottom: 6px; display: block; letter-spacing: 1px; }
      input {
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
        padding: 12px 16px; border-radius: 12px; color: #fff; width: 100%; box-sizing: border-box;
        transition: all 0.3s; font-size: 0.95rem;
        &::placeholder { color: rgba(255,255,255,0.3); }
        &:focus { background: rgba(255,255,255,0.08); border-color: var(--accent); box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); outline: none; }
      }
    }
    .shadow-btn { transition: transform 0.3s, box-shadow 0.3s; }
    .shadow-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); }
    .divider { margin: 25px 0; font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
    .google-btn {
      width: 100%; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;
      color: #fff; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;
      img { width: 18px; }
      &:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin() {
    this.loading = true;
    try {
      // Map username to a mock email for Firebase Auth
      const email = this.username.includes('@') ? this.username : `${this.username}@gaydel.com`;
      await this.authService.loginWithEmail(email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e);
      alert('Identifiant ou mot de passe incorrect');
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
