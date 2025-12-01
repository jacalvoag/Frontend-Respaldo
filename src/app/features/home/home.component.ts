// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ActiveProjectsComponent } from './components/active-projects.component/active-projects.component';
import { GeneralInfoComponent } from './components/general-info.component/general-info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, ActiveProjectsComponent, GeneralInfoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  recentProjects: Project[] = [];
  loading = true;

  // Estadísticas
  totalProjects = 0;
  activeProjects = 0;
  completedProjects = 0;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getUserProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error cargando proyectos:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalProjects = this.projects.length;
    this.activeProjects = this.projects.filter(p => p.status === 'Activo').length;
    this.completedProjects = this.projects.filter(p => p.status === 'Terminado').length;
    this.recentProjects = this.projects.slice(0, 3); // Últimos 3 proyectos
  }
}