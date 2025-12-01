// src/app/features/my-project/my-project.component.ts
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { NewProjectFormComponent } from './forms/newproject-forms/newproject-form.component';

@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, NewProjectFormComponent],
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.css']
})
export class MyProjectComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  textError: string = '';
  openMenuId: number | null = null;
  showGrid = true;
  showNewProjectModal = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getUserProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.loading = false;
        console.log('✅ Proyectos cargados:', this.projects.length);
      },
      error: (err: any) => {
        console.error('❌ Error cargando proyectos:', err);
        this.loading = false;
        this.textError = err.message || 'Error al cargar proyectos';
      }
    });
  }

  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  closeNewProjectModal(): void {
    this.showNewProjectModal = false;
  }

  /**
   * ✅ CORREGIDO: Recibe el payload del backend y lo envía al servicio
   */
  onProjectCreated(projectPayload: any): void {
    console.log('📥 Payload recibido del modal:', projectPayload);
    
    this.projectService.createProject(projectPayload).subscribe({
      next: (createdProject: Project) => {
        console.log('✅ Proyecto creado exitosamente:', createdProject);
        this.projects = [createdProject, ...this.projects];
        this.closeNewProjectModal();
      },
      error: (err: any) => {
        console.error('❌ Error creando proyecto:', err);
        alert('Error al crear proyecto: ' + err.message);
      }
    });
  }

  deleteProject(projectId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== projectId);
          this.openMenuId = null;
          console.log('✅ Proyecto eliminado');
        },
        error: (err: any) => {
          console.error('❌ Error eliminando proyecto:', err);
          alert('Error: ' + err.message);
        }
      });
    }
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  toggleView(): void {
    this.showGrid = !this.showGrid;
  }
}