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
          <div class="coffee-icon">☕</div>
          <h1>GAYDEL</h1>
          <div class="separator"></div>
          <p>L'excellence du café en un clic</p>
        </div>

        <form (submit)="onLogin()">
          <div class="form-group">
            <label>Identifiant</label>
            <div class="input-wrapper">
              <input type="text" [(ngModel)]="username" name="username" placeholder="Entrez votre identifiant" required>
            </div>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <div class="input-wrapper">
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
            </div>
          </div>
          <button type="submit" class="premium-btn gold-gradient shadow-btn" [disabled]="loading">
            {{ loading ? 'Connexion en cours...' : 'SE CONNECTER' }}
          </button>
        </form>

        <div class="divider"><span>OU CONTINUER AVEC</span></div>

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
    }
    .bg-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, rgba(62, 39, 35, 0.9), rgba(0, 0, 0, 0.7));
    }
    .login-card {
      width: 420px; padding: 50px; text-align: center; position: relative; z-index: 10;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 30px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      animation: slideUp 0.8s ease-out;
    }
    .logo-area {
      margin-bottom: 40px;
      .coffee-icon { font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px var(--secondary-color)); }
      h1 { margin: 0; font-size: 2.8rem; letter-spacing: 8px; color: #fff; font-weight: 900; }
      .separator { width: 50px; height: 3px; background: var(--secondary-color); margin: 15px auto; border-radius: 2px; }
      p { color: rgba(255,255,255,0.6); font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }
    }
    .form-group {
      margin-bottom: 25px; text-align: left;
      label { font-size: 0.8rem; font-weight: 700; color: var(--secondary-color); text-transform: uppercase; margin-bottom: 8px; display: block; letter-spacing: 1px; }
      input {
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        padding: 15px; border-radius: 12px; color: #fff; width: 100%; box-sizing: border-box;
        transition: all 0.3s; font-size: 1rem;
        &:focus { background: rgba(255,255,255,0.1); border-color: var(--secondary-color); box-shadow: 0 0 15px rgba(215, 179, 119, 0.2); outline: none; }
      }
    }
    .gold-gradient { background: linear-gradient(45deg, #d7b377, #b8860b); color: #3e2723 !important; font-weight: 800; letter-spacing: 2px; }
    .shadow-btn { box-shadow: 0 10px 20px rgba(184, 134, 11, 0.3); border: none; transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; }
    .shadow-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(184, 134, 11, 0.4); }
    .divider { margin: 30px 0; font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
    .google-btn {
      width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 12px;
      color: #fff; font-weight: 600; cursor: pointer; transition: background 0.3s;
      img { width: 18px; }
      &:hover { background: rgba(255,255,255,0.15); }
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
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
