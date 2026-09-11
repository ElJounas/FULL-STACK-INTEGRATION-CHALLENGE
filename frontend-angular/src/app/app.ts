import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoListaComponent } from './components/producto-lista/producto-lista';
import { PedidoListaComponent } from './components/pedido-lista/pedido-lista';
import { DashboardComponent } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductoListaComponent, PedidoListaComponent, DashboardComponent],
  template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; min-height: 100vh;">
      
      <nav style="background-color: #1e293b; color: white; padding: 0.8rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.5px;">Gestión de Última Milla</span>
        </div>

        <div style="display: flex; gap: 8px;">
          <button 
            (click)="seccionActual = 'dashboard'" 
            [style.background-color]="seccionActual === 'dashboard' ? '#3b82f6' : 'transparent'"
            [style.color]="seccionActual === 'dashboard' ? '#ffffff' : '#cbd5e1'"
            style="border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: all 0.2s ease;">
            Dashboard
          </button>

          <button 
            (click)="seccionActual = 'productos'" 
            [style.background-color]="seccionActual === 'productos' ? '#3b82f6' : 'transparent'"
            [style.color]="seccionActual === 'productos' ? '#ffffff' : '#cbd5e1'"
            style="border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: all 0.2s ease;">
            Productos
          </button>

          <button 
            (click)="seccionActual = 'pedidos'" 
            [style.background-color]="seccionActual === 'pedidos' ? '#3b82f6' : 'transparent'"
            [style.color]="seccionActual === 'pedidos' ? '#ffffff' : '#cbd5e1'"
            style="border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: all 0.2s ease;">
            Pedidos
          </button>
        </div>
      </nav>

      <main style="max-width: 1200px; margin: 20px auto; padding: 0 20px;">
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 10px;">
          <app-dashboard *ngIf="seccionActual === 'dashboard'"></app-dashboard>
          <app-producto-lista *ngIf="seccionActual === 'productos'"></app-producto-lista>
          <app-pedido-lista *ngIf="seccionActual === 'pedidos'"></app-pedido-lista>
        </div>
      </main>

    </div>
  `
})
export class App {
  title = 'frontend-angular';
  seccionActual: 'dashboard' | 'productos' | 'pedidos' = 'dashboard';
}