import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { IconService } from '../../core/services/icon.service';
import { DataService } from '../../core/services/data.service';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, AsyncPipe],
  template: `
    <div class="dashboard-page">
      <div class="welcome-section">
        <h2>Tableau de Bord</h2>
        <p>Aperçu en temps réel de votre activité GAYDEL</p>
      </div>

      <div class="kpi-grid" *ngIf="stats$ | async as s">
        <div class="kpi-card glass-card">
          <div class="icon-box coffee" [innerHTML]="iconService.getIcon('sales')"></div>
          <div class="content">
            <span class="label">Ventes (Estimées)</span>
            <span class="value">{{s.sales}} FCFA</span>
            <span class="trend positive">+12% vs hier</span>
          </div>
        </div>
        <div class="kpi-card glass-card">
          <div class="icon-box green" [innerHTML]="iconService.getIcon('users')"></div>
          <div class="content">
            <span class="label">Vendeurs Actifs</span>
            <span class="value">{{s.sellers}}</span>
            <span class="trend">En ligne</span>
          </div>
        </div>
        <div class="kpi-card glass-card">
          <div class="icon-box brown" [innerHTML]="iconService.getIcon('stock')"></div>
          <div class="content">
            <span class="label">Stock Global</span>
            <span class="value">{{s.stock}} {{s.stockUnit}}</span>
            <span class="trend" [class.negative]="s.lowStock > 0">
              {{s.lowStock > 0 ? s.lowStock + ' alertes faibles' : 'Stock optimal'}}
            </span>
          </div>
        </div>
        <div class="kpi-card glass-card">
          <div class="icon-box blue" [innerHTML]="iconService.getIcon('prospects')"></div>
          <div class="content">
            <span class="label">Prospects</span>
            <span class="value">{{s.prospects}}</span>
            <span class="trend positive">+{{s.newProspects}} ce matin</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-container glass-card">
          <h3>Ventes par Semaine</h3>
          <canvas baseChart
            [data]="lineChartData"
            [options]="lineChartOptions"
            [type]="'line'">
          </canvas>
        </div>
        <div class="chart-container glass-card">
          <h3>Distribution du Stock</h3>
          <canvas baseChart
            [data]="pieChartData"
            [options]="pieChartOptions"
            [type]="'pie'">
          </canvas>
        </div>
      </div>

      <div class="recent-activities glass-card">
        <h3>Activités Récentes</h3>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let i of [1,2,3,4]">
            <div class="dot"></div>
            <div class="text">
              <strong>Moussa Diop</strong> a vendu 5kg de Café Arabica
              <span>Il y a 10 minutes - Dakar, Plateau</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { padding: 1.5rem 0; }
    .welcome-section {
      margin-bottom: 2.5rem;
      h2 { margin: 0; color: var(--primary); font-weight: 800; font-size: 2rem; letter-spacing: -0.5px; }
      p { margin: 8px 0 0; color: var(--text-muted); font-size: 1rem; }
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .kpi-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      .icon-box {
        width: 54px; height: 54px;
        border-radius: 16px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: var(--shadow-sm);
        &.coffee { background: #EFEBE9; color: var(--primary); }
        &.green { background: #E8F5E9; color: #2D6A4F; }
        &.brown { background: #FCF5E5; color: #B08968; }
        &.blue { background: #E3F2FD; color: #1976D2; }
        svg { width: 26px; height: 26px; }
      }
      .content {
        display: flex; flex-direction: column;
        .label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-size: 1.4rem; font-weight: 800; color: var(--primary); margin: 2px 0; }
        .trend { font-size: 0.75rem; font-weight: 600;
          &.positive { color: var(--success); }
          &.negative { color: var(--error); }
        }
      }
    }
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      @media (max-width: 1200px) { grid-template-columns: 1fr; }
    }
    .chart-container {
      padding: 1.5rem;
      h3 { margin: 0 0 1.5rem; font-size: 1.1rem; color: var(--primary); font-weight: 700; }
      canvas { width: 100% !important; height: 320px !important; }
    }
    .recent-activities {
      padding: 1.5rem;
      h3 { margin: 0 0 1.5rem; color: var(--primary); font-weight: 700; }
    }
    .activity-list {
      display: flex; flex-direction: column; gap: 1rem;
    }
    .activity-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.8rem; border-radius: 12px; transition: background 0.2s ease;
      &:hover { background: rgba(75, 54, 33, 0.03); }
      .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(212, 175, 55, 0.4); }
      .text {
        display: flex; flex-direction: column;
        font-size: 0.95rem; color: var(--text-main);
        span { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  iconService = inject(IconService);
  private dataService = inject(DataService);

  stats$ = combineLatest([
    this.dataService.getList<any>('users'),
    this.dataService.getList<any>('stock'),
    this.dataService.getList<any>('prospects')
  ]).pipe(
    map(([users, stock, prospects]) => ({
      sales: '1,250,000', // Mocked as we don't have sales col yet
      sellers: users.filter(u => u.role === 'SELLER').length || 0,
      stock: stock.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
      stockUnit: stock[0]?.unit || 'kg',
      lowStock: stock.filter(s => s.quantity <= (s.minThreshold || 20)).length,
      prospects: prospects.length,
      newProspects: prospects.filter(p => p.status === 'NEW').length
    }))
  );

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Ventes hebdomadaires',
        backgroundColor: 'rgba(62, 39, 35, 0.1)',
        borderColor: '#3e2723',
        pointBackgroundColor: '#3e2723',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(62, 39, 35, 0.8)',
        fill: 'origin',
      }
    ],
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  public pieChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [300, 500, 100],
      backgroundColor: ['#3e2723', '#a1887f', '#2e7d32']
    }],
    labels: ['Entrepôt Central', 'Dakar Nord', 'Saint-Louis']
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit() {}
}
