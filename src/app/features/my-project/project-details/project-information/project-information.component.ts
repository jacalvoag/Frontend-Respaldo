// src/app/features/my-project/project-details/project-information/project-information.component.ts
import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { Project } from '../../../../core/models/project.model';
import { Zones } from '../../../../core/models/zones.model';
import { CommonModule } from '@angular/common';
import { NewProjectFormComponent } from '../../forms/newproject-forms/newproject-form.component';
import { NewZoneFormComponent } from '../../forms/newzone-form/newzone-form.component';

@Component({
  selector: 'app-project-information',
  templateUrl: './project-information.component.html',
  styleUrl: './project-information.component.css',
  standalone: true,
  imports: [RouterLink, CommonModule, NewProjectFormComponent, NewZoneFormComponent]
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  info = signal<Project | null>(null);
  private paramSub!: Subscription;
  showGrid = true;
  showEditModal = false;
  showNewZoneModal = false;
  openMenuId: number | null = null;
  projectId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private studyZoneService: StudyZoneService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.projectId = id;
        this.loadProjectWithZones(id);
      }
    });
  }

  loadProjectWithZones(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project: Project) => {
        this.info.set(project);
        
        this.studyZoneService.getStudyZonesByProject(projectId).subscribe({
          next: (zones: Zones[]) => {
            const updatedProject = {
              ...project,
              zone: zones,
              numberOfZones: zones.length
            };
            this.info.set(updatedProject);
            console.log('✅ Proyecto con zonas cargado');
          },
          error: (err: any) => console.error('❌ Error cargando zonas:', err)
        });
      },
      error: (err: any) => {
        console.error('❌ Error cargando proyecto:', err);
        this.info.set(null);
      }
    });
  }

  openEditModal(): void {
    console.log('🖊️ Abriendo modal de edición para proyecto:', this.info()?.id);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openNewZoneModal(): void {
    this.showNewZoneModal = true;
  }

  closeNewZoneModal(): void {
    this.showNewZoneModal = false;
  }

  /**
   * ✅ NUEVO: Manejador del evento projectUpdated
   */
onProjectUpdated(event: { id: number; data: any }): void {
  console.log('📥 Evento de actualización recibido:', event);
  
  // ✅ Enviar solo event.data, el id ya está en la URL
  this.projectService.updateProject(event.id, event.data).subscribe({
    next: (updatedProject: Project) => {
      console.log('✅ Proyecto actualizado exitosamente:', updatedProject);
      this.loadProjectWithZones(this.projectId);
      this.closeEditModal();
    },
    error: (err: any) => {
      console.error('❌ Error actualizando proyecto:', err);
      alert('Error al actualizar proyecto: ' + err.message);
    }
  });
}

  onZoneCreated(newZone: Zones): void {
    this.loadProjectWithZones(this.projectId);
  }

  toggleMenu(zoneId: number): void {
    this.openMenuId = this.openMenuId === zoneId ? null : zoneId;
  }

  deleteZone(zoneId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta zona?')) {
      this.studyZoneService.deleteStudyZone(this.projectId, zoneId).subscribe({
        next: () => {
          console.log('✅ Zona eliminada');
          this.loadProjectWithZones(this.projectId);
          this.openMenuId = null;
        },
        error: (err: any) => {
          console.error('❌ Error:', err);
          alert('Error: ' + err.message);
        }
      });
    }
  }

  toggleView(): void {
    this.showGrid = !this.showGrid;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.button-option')) {
      this.openMenuId = null;
    }
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
  }
}