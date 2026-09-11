import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Importar FormsModule
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe, FormsModule], // <--- Agregar a imports
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css'
})
export class ProductoListaComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);
  
  productos: Producto[] = [];

  // Objeto para capturar los datos del formulario
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

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.productoService.crear(this.nuevoProducto).subscribe({
      next: (res) => {
        console.log('JSON Enviado / Respuesta Backend (HTTP 201 Created):', res);
        this.cargarProductos(); // Refresca la tabla automáticamente
        this.nuevoProducto = { nombre: '', categoria: '', precio: 0, stock: 0 }; // Limpia el formulario
      },
      error: (err) => console.error('Error al crear producto:', err)
    });
  }
}