import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class Landing {
   features = [
    {
      icon: 'calculate',
      title: 'Cálculo de biodiversidad',
      description: 'Potencia Analítica y Flexibilidad. Estas herramientas están diseñadas para realizar cálculos complejos (Shannon, Simpson, etc.) utilizando los datos de especies exportados desde tu predio.'
    },
    {
      icon: 'eco',
      title: 'Registro de especies',
      description: 'Permite al usuario crear y registrar todas las especies existentes en el predio, ayuda a la organización y de ellas.'
    },
    {
      icon: 'location_on',
      title: 'Registro de predios',
      description: 'Precisión y Gestión Espacial. Permite importar límites oficiales del predio, crear nuevos, registrar especies y calcular su biodiversidad.'
    }
  ];

  constructor(private router: Router) {}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}






  

