import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido';
import { ProductoService } from '../../services/producto';
import { Pedido } from '../../models/pedido';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-pedido-lista',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './pedido-lista.html',
  styleUrl: './pedido-lista.css'
})
export class PedidoListaComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  productos: Producto[] = [];

  nuevoCliente: string = '';
  prioridadSeleccionada: string = 'ALTA';
  productoSeleccionadoId: number | null = null;
  cantidad: number = 1;

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarProductos();
  }

  cargarPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (datos) => {
        this.pedidos = datos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al listar pedidos:', err);
        if (err.status === 0) {
          alert('No fue posible conectar con el servidor. Verifica que el backend esté disponible.');
        } else {
          alert('Ocurrió un error al cargar los pedidos.');
        }
      }
    });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (datos) => this.productos = datos,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  crearPedido(): void {
    if (!this.nuevoCliente || !this.productoSeleccionadoId) {
      alert('Por favor indica el cliente y selecciona un producto.');
      return;
    }

    const nuevoPedido: Pedido = {
      cliente: this.nuevoCliente,
      productoId: Number(this.productoSeleccionadoId),
      cantidad: Number(this.cantidad),
      prioridad: this.prioridadSeleccionada
    };

    this.pedidoService.crear(nuevoPedido).subscribe({
      next: () => {
        this.cargarPedidos();
        this.nuevoCliente = '';
        this.cantidad = 1;
        this.prioridadSeleccionada = 'ALTA';
      },
      error: (err) => alert(err.error?.message || 'Error al crear pedido en el servidor')
    });
  }

  confirmarPedido(id: number | undefined): void {
  if (!id) return;
    this.pedidoService.confirmar(id).subscribe({
      next: () => {
        this.cargarPedidos();
        this.cargarProductos(); // Refresca automáticamente el stock de productos
      },
      error: (err) => alert(err.error?.message || 'No se pudo confirmar el pedido')
    });
  }

  cancelarPedido(id: number | undefined): void {
    if (!id) return;
    this.pedidoService.cancelar(id).subscribe({
      next: () => this.cargarPedidos(),
      error: (err) => alert(err.error?.message || 'No se pudo cancelar el pedido')
    });
  }

  despacharPedido(id: number | undefined): void {
    if (!id) return;
    this.pedidoService.despachar(id).subscribe({
      next: () => {
        this.cargarPedidos();
        this.cargarProductos(); // Refresca automáticamente el stock de productos
      },
      error: (err) => alert(err.error?.message || 'No se pudo despachar el pedido')
    });
  }
}