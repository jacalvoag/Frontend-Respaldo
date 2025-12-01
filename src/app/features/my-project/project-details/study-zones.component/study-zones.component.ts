import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { Zones } from '../../../../core/models/zones.model';
import { ProjectService } from '../../../../core/services/project.service';
import { BiodiversityAnalysisComponent } from '../biodiversity-analysis/biodiversity-analysis.component';
import { filter } from 'rxjs';
import { NewZoneFormComponent } from '../../forms/newzone-form/newzone-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-zones',
  templateUrl: './study-zones.component.html',
  styleUrl: './study-zones.component.css',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkWithHref, NewZoneFormComponent, CommonModule, BiodiversityAnalysisComponent]
})
export class StudyZonesComponent implements OnInit, OnDestroy {
  project = signal<Project | null>(null);
  zones = signal<Zones[]>([]); 
  private paramSub!: Subscription;
  showGrid = true;
  showEditZoneModal = false;

  activeZoneId = signal<number | null>(null);
  activeZone = computed(() => {
    const activeId = this.activeZoneId();
    if (!activeId) return null;
    return this.zones().find(z => z.idZone === activeId) || null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const projectId = +params.get('id')!;  
      const zoneId = +params.get('idZone')!; 
      
      if (projectId) {
        this.loadProjectZones(projectId); // Carga las N zonas
        this.activeZoneId.set(zoneId);
      }
      this.setupRouteListener();
    });
  }

  private loadProjectZones(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        this.project.set(data || null);
        
        if (data?.zone) {
          // CORRECCIÓN: Asigna TODAS las zonas al signal 'zones' para que el @for funcione
          this.zones.set(data.zone);
        } else {
          this.zones.set([]);
        }
      },
      error: () => {
        this.project.set(null);
        this.zones.set([]);
      }
    });
  }

  openEditZoneModal(): void {
    this.showEditZoneModal = true;
  }

  closeEditZoneModal(): void {
    this.showEditZoneModal = false;
  }

  onZoneUpdated(updatedZone: Zones): void {
    this.zones.set([updatedZone]);
    console.log('Zona actualizada:', updatedZone);
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