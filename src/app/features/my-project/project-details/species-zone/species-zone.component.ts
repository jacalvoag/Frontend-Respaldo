import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Zones } from '../../../../core/models/zones.model';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { SpeciesService } from '../../../../core/services/species.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { NewSpecieFormComponent } from '../../forms/newspecie-form/newspecie-form.component';

@Component({
  selector: 'app-species-zone.component',
  standalone: true,
  imports: [CommonModule, NewSpecieFormComponent],
  templateUrl: './species-zone.component.html',
  styleUrl: './species-zone.component.css',
})
export class SpeciesZoneComponent implements OnInit, OnDestroy {
  currentZone = signal<Zones | null>(null);
  recordedSpecies = signal<RercordedSpecies[]>([]);
  loading = signal(true);
  openMenuId: number | null = null;
  showAddSpeciesModal = false;
  showEditSpeciesModal = false;
  selectedSpecies: RercordedSpecies | null = null;
  projectId: number = 0;
  zoneId: number = 0;

  private paramSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private speciesService: SpeciesService,
    private studyZoneService: StudyZoneService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;
      this.zoneId = +params.get('idZone')!;
      
      console.log('ngOnInit - projectId:', this.projectId);
      console.log('ngOnInit - zoneId:', this.zoneId);

      this.loadZoneData();
      this.loadSpeciesData();
    });
  }

  private loadZoneData(): void {
    this.studyZoneService.getStudyZoneById(this.zoneId).subscribe({
      next: (zone) => {
        this.currentZone.set(zone);
      },
      error: (err) => {
        console.error('Error cargando zona:', err);
      }
    });
  }

  private loadSpeciesData(): void {
    this.loading.set(true);

    this.speciesService.getSpeciesByZone(this.zoneId).subscribe({
      next: (species) => {
        this.recordedSpecies.set(species);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando especies:', err);
        this.recordedSpecies.set([]);
        this.loading.set(false);
      }
    });
  }

  get totalSpecies(): number {
    return this.recordedSpecies().length;
  }

  get totalIndividuals(): number {
    return this.recordedSpecies().reduce((total, species) => {
      const count = parseInt(species.numberOfIndividuals) || 0;
      return total + count;
    }, 0);
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  openAddSpeciesModal(): void {
    console.log('Abriendo modal - projectId:', this.projectId);
    console.log('Abriendo modal - zoneId:', this.zoneId);
    this.selectedSpecies = null;
    this.showAddSpeciesModal = true;
  } 

  closeAddSpeciesModal(): void {
    this.showAddSpeciesModal = false;
    this.selectedSpecies = null;
  }

  onSpeciesCreated(speciesPayload: any): void {
    this.speciesService.createSpeciesInZone(this.zoneId, speciesPayload).subscribe({
      next: (createdSpecies: RercordedSpecies) => {
        this.loadSpeciesData();
        this.closeAddSpeciesModal();
      },
      error: (err: any) => {
        alert('Error al crear especie: ' + err.message);
      }
    });
  }

  editSpecies(species: RercordedSpecies): void {
    this.selectedSpecies = species;
    this.showEditSpeciesModal = true;
    this.openMenuId = null;
  }

  closeEditSpeciesModal(): void {
    this.showEditSpeciesModal = false;
    this.selectedSpecies = null;
  }

  onSpeciesUpdated(event: { id: number; data: any }): void {
    this.speciesService.updateSpeciesInZone(this.zoneId, event.id, event.data).subscribe({
      next: (updatedSpecies: RercordedSpecies) => {
        this.loadSpeciesData();
        this.closeEditSpeciesModal();
      },
      error: (err: any) => {
        alert('Error al actualizar especie: ' + err.message);
      }
    });
  }

  deleteSpecies(speciesId: number): void {
    if (confirm('¿Estas seguro de que deseas eliminar esta especie?')) {
      this.speciesService.deleteSpeciesFromZone(this.zoneId, speciesId).subscribe({
        next: () => {
          this.loadSpeciesData();
          this.openMenuId = null;
        },
        error: (err: any) => {
          alert('Error al eliminar especie: ' + err.message);
        }
      });
    }
  }

  

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}