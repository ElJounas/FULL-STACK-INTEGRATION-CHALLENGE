import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { PedidoService } from '../../services/pedido';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private productoService = inject(ProductoService);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  totalProductos: number = 0;
  productosStockBajo: number = 0;
  
  totalPedidos: number = 0;
  pedidosPendientes: number = 0;
  pedidosUrgentes: number = 0;
  pedidosConfirmados: number = 0;

  ngOnInit(): void {
    // Se ejecuta de inmediato cada vez que cambias a la pestaña del Dashboard
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.productoService.listar().subscribe({
      next: (prods: Producto[]) => {
        this.totalProductos = prods.length;
        this.productosStockBajo = prods.filter(p => p.stock <= 5).length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 0) {
          alert('No fue posible conectar con el servidor. Verifica que el backend esté disponible.');
        }
      }
    });
  
    this.pedidoService.obtenerResumen().subscribe({
      next: (resumen) => {
        this.totalPedidos = resumen.total;
        this.pedidosPendientes = resumen.pendientes;
        this.pedidosConfirmados = resumen.confirmados;
        this.pedidosUrgentes = resumen.urgentes;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 0) {
          console.error('Servidor desconectado.');
        }
      }
    });
  }
}