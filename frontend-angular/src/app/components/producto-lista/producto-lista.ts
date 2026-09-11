import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe, FormsModule],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css'
})
export class ProductoListaComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);
  
  productos: Producto[] = [];
  editando: boolean = false;

  nuevoProducto: Producto = {
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0
  };

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (datos) => {
        this.productos = datos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar productos:', err);
        if (err.status === 0) {
          alert('No fue posible conectar con el servidor. Verifica que el backend esté disponible.');
        } else {
          alert('Ocurrió un error al cargar los productos.');
        }
      }
    });
  }

  seleccionarParaEditar(prod: Producto): void {
    this.nuevoProducto = { ...prod };
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoProducto = { nombre: '', categoria: '', precio: 0, stock: 0 };
    this.editando = false;
  }

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (this.editando && this.nuevoProducto.id) {
      this.productoService.actualizar(this.nuevoProducto.id, this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => console.error('Error al actualizar:', error)
      });
    } else {
      this.productoService.crear(this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => console.error('Error al crear:', error)
      });
    }
  }

  // Método de eliminación controlada con confirmación
  eliminarProducto(id: number | undefined): void {
    if (!id) return;

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmacion) {
      this.productoService.eliminar(id).subscribe({
        next: () => this.cargarProductos(),
        error: (error) => console.error('Error al eliminar producto:', error)
      });
    }
  }

  // Método para clasificar el estado visual del stock
  obtenerBadgeStock(stock: number): { texto: string; color: string } {
    if (stock === 0) {
      return { texto: 'AGOTADO', color: '#dc3545' };
    } else if (stock <= 3) {
      return { texto: 'CRÍTICO', color: '#fd7e14' };
    } else if (stock <= 6) {
      return { texto: 'BAJO', color: '#ffc107' };
    } else {
      return { texto: 'DISPONIBLE', color: '#28a745' };
    }
  }
}