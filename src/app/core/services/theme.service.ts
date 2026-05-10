import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark-theme');
    }
  }
}
