import { Component } from '@angular/core';
import { ProductoListaComponent } from './components/producto-lista/producto-lista';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductoListaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend-angular';
}