import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css'
})
export class ProductoListaComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef); // <--- Inyectar el detector de cambios
  
  productos: Producto[] = [];

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (datos) => {
        console.log('Datos recibidos del backend:', datos);
        this.productos = datos;
        this.cdr.detectChanges(); // <--- Forzar a Angular a actualizar la tabla en pantalla
      },
      error: (err) => console.error('Error al consultar productos:', err)
    });
  }
}