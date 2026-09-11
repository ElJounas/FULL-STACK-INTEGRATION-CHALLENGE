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
  editando: boolean = false; // Estado para saber si creamos o editamos

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

  // Cargar datos del producto seleccionado en el formulario
  seleccionarParaEditar(prod: Producto): void {
    this.nuevoProducto = { ...prod }; // Copia de los datos
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
      // Petición PUT para actualizar
      this.productoService.actualizar(this.nuevoProducto.id, this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => console.error('Error al actualizar:', error)
      });
    } else {
      // Petición POST para crear
      this.productoService.crear(this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => console.error('Error al crear:', error)
      });
    }
  }
}