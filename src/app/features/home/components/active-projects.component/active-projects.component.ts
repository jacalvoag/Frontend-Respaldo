import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-active-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-projects.component.html',
  styleUrl: './active-projects.component.css',
})
export class ActiveProjectsComponent {
  // Recibe los proyectos desde el componente padre (home)
  @Input() projects: Project[] = [];
  @Input() loading: boolean = false;

  // Filtra solo los proyectos activos (primeros 3)
  get activeProjects(): Project[] {
    return this.projects.filter(p => p.status === 'Activo').slice(0, 3);
  }

  // Cuenta total de proyectos activos
  get activeCount(): number {
    return this.projects.filter(p => p.status === 'Activo').length;
  }
}