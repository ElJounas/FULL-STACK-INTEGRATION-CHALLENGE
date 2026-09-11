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
      error: (err) => console.error('Error al consultar productos:', err)
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
}