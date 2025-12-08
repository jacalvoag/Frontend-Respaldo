import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
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
  loading: boolean = true;
  textError: string = '';
  openMenuId: number | null = null;
  showGrid: boolean = true;
  showNewProjectModal: boolean = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }
  loadProjects(): void {
    this.loading = true;
    this.textError = '';
    
    this.projectService.getUserProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.loading = false;
        console.log('Proyectos cargados:', this.projects.length);
      },
      error: (err: any) => {
        console.error('Error cargando proyectos:', err);
        this.loading = false;
        this.textError = 'No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.';
      }
    });
  }

  onProjectCreated(projectPayload: any): void {
    console.log('Procesando nuevo proyecto:', projectPayload);

    if (projectPayload && projectPayload.id) {
      this.updateLocalProjects(projectPayload);
      this.closeNewProjectModal();
      return;
    }

    this.projectService.createProject(projectPayload).subscribe({
      next: (createdProject: Project) => {
        this.updateLocalProjects(createdProject);
        this.closeNewProjectModal();
      },
      error: (err: any) => {
        console.error('Error al crear el proyecto:', err);
        alert('Error: No se pudo guardar el proyecto.');
      }
    });
  }

  
  private updateLocalProjects(newProject: Project): void {
    this.projects = [newProject, ...this.projects];
  }

  
  deleteProject(projectId: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.openMenuId = null;
        console.log(`Proyecto ${projectId} eliminado correctamente.`);
      },
      error: (err: any) => {
        console.error('Error eliminando proyecto:', err);
        alert('Ocurrió un error al intentar eliminar el proyecto.');
      }
    });
  }

 
  openNewProjectModal(): void {
    this.showNewProjectModal = true;
  }

  closeNewProjectModal(): void {
    this.showNewProjectModal = false;
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  toggleView(): void {
    this.showGrid = !this.showGrid;
  }
}