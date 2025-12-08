import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { Zones } from '../../../../core/models/zones.model';
import { ProjectService } from '../../../../core/services/project.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { filter } from 'rxjs';
import { NewZoneFormComponent } from '../../forms/newzone-form/newzone-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-zones',
  templateUrl: './study-zones.component.html',
  styleUrl: './study-zones.component.css',
  standalone: true,
  imports: [RouterLink, NewZoneFormComponent, CommonModule]
})
export class StudyZonesComponent implements OnInit, OnDestroy {
  project = signal<Project | null>(null);
  zones = signal<Zones[]>([]); 
  activeZone = signal<Zones | null>(null);
  
  private paramSub!: Subscription;
  showGrid = true;
  showEditZoneModal = false;
  selectedZone: Zones | null = null;
  projectId: number = 0;
  zoneId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private studyZoneService: StudyZoneService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const projectId = +params.get('id')!;  
      const zoneId = +params.get('idZone')!; 
      
      console.log('Parametros de ruta - projectId:', projectId, 'zoneId:', zoneId);
      
      if (projectId && zoneId) {
        this.projectId = projectId;
        this.zoneId = zoneId;
        this.loadProjectWithZones(projectId, zoneId);
      }
      this.setupRouteListener();
    });
  }

  private loadProjectWithZones(projectId: number, zoneId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project: Project) => {
        this.project.set(project);
        
        this.studyZoneService.getStudyZonesByProject(projectId).subscribe({
          next: (zones: Zones[]) => {
            console.log('Zonas cargadas desde servicio:', zones);
            this.zones.set(zones);
            
            const currentZone = zones.find(z => z.idZone === zoneId);
            console.log('Zona actual encontrada:', currentZone);
            
            if (currentZone) {
              this.activeZone.set(currentZone);
            } else {
              console.error('No se encontro zona con ID:', zoneId);
            }
          },
          error: (err: any) => {
            console.error('Error cargando zonas:', err);
            this.zones.set([]);
            this.activeZone.set(null);
          }
        });
      },
      error: (err: any) => {
        console.error('Error cargando proyecto:', err);
        this.project.set(null);
        this.zones.set([]);
        this.activeZone.set(null);
      }
    });
  }

  openEditZoneModal(): void {
    const zone = this.activeZone();
    console.log('Intentando abrir modal de edicion');
    console.log('Zona activa:', zone);
    
    if (zone) {
      console.log('Abriendo modal de edicion para zona:', zone.idZone);
      this.selectedZone = zone;
      this.showEditZoneModal = true;
      console.log('showEditZoneModal:', this.showEditZoneModal);
      console.log('selectedZone:', this.selectedZone);
    } else {
      console.error('No hay zona activa para editar');
      alert('No se pudo cargar la zona para editar. Por favor recarga la pagina.');
    }
  }

  closeEditZoneModal(): void {
    console.log('Cerrando modal de edicion');
    this.showEditZoneModal = false;
    this.selectedZone = null;
  }

  onZoneUpdated(event: { id: number; data: any }): void {
    console.log('Evento de actualizacion recibido:', event);
    
    this.studyZoneService.updateStudyZone(event.id, event.data).subscribe({
      next: (updatedZone: Zones) => {
        console.log('Zona actualizada exitosamente:', updatedZone);
        this.loadProjectWithZones(this.projectId, this.zoneId);
        this.closeEditZoneModal();
      },
      error: (err: any) => {
        console.error('Error actualizando zona:', err);
        alert('Error al actualizar zona: ' + err.message);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showGrid = !this.route.firstChild;
      });
  }
}