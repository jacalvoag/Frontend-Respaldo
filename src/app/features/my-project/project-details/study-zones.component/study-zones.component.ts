import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { Project } from '../../../../core/models/project.model';
import { Zones } from '../../../../core/models/zones.model';
import { CommonModule } from '@angular/common';
import { NewZoneFormComponent } from '../../forms/newzone-form/newzone-form.component';

@Component({
  selector: 'app-study-zones',
  templateUrl: './study-zones.component.html',
  styleUrl: './study-zones.component.css',
  standalone: true,
  imports: [RouterLink, CommonModule, NewZoneFormComponent]
})
export class StudyZonesComponent implements OnInit, OnDestroy {
  zone = signal<Zones | null>(null);
  zones = signal<Zones[]>([]);
  activeZone = signal<Zones | null>(null);
  projectName = signal<string>('');
  private paramSub!: Subscription;
  showEditModal = false;
  showEditZoneModal = false;
  openMenuId: number | null = null;
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
      const zoneId = +params.get('zoneId')!;
      
      if (projectId && zoneId) {
        this.projectId = projectId;
        this.zoneId = zoneId;
        this.loadZoneDetails(projectId, zoneId);
      }
    });
  }

  loadZoneDetails(projectId: number, zoneId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project: Project) => {
        this.projectName.set(project.name);
      },
      error: (err: any) => {}
    });

    this.studyZoneService.getStudyZoneById(zoneId).subscribe({
      next: (zone: Zones) => {
        this.zone.set(zone);
        this.activeZone.set(zone);
        this.zones.set([zone]);
        
        this.studyZoneService.getStudyZoneBiodiversity(zoneId).subscribe({
          next: (indices: any) => {
            const updatedZone = {
              ...zone,
              biodiversityAnalysis: indices
            };
            this.zone.set(updatedZone);
            this.activeZone.set(updatedZone);
            this.zones.set([updatedZone]);
          },
          error: (err: any) => {}
        });
      },
      error: (err: any) => {
        this.zone.set(null);
        this.activeZone.set(null);
      }
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
    this.showEditZoneModal = true;
  }

  openEditZoneModal(): void {
    this.showEditZoneModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.showEditZoneModal = false;
  }

  closeEditZoneModal(): void {
    this.showEditZoneModal = false;
  }

  onZoneUpdated(updated: Zones): void {
    this.loadZoneDetails(this.projectId, this.zoneId);
  }

  toggleMenu(): void {
    this.openMenuId = this.openMenuId === null ? this.zoneId : null;
  }

  deleteZone(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta zona?')) {
      this.studyZoneService.deleteStudyZone(this.projectId, this.zoneId).subscribe({
        next: () => {
          this.router.navigate(['/my-project', this.projectId]);
        },
        error: (err: any) => {
          alert('Error: ' + err.message);
        }
      });
    }
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