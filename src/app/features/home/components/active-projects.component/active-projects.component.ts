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
  @Input() projects: Project[] = [];
  @Input() loading: boolean = false;

get displayProjects(): Project[] {
  return this.projects.filter(p => p.status === 'Activo').slice(0, 4);
}

  get activeCount(): number {
    return this.projects.filter(p => p.status === 'Activo').length;
  }
}