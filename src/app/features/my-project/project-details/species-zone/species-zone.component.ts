import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpeciesService } from '../../../../core/services/species.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { Zones } from '../../../../core/models/zones.model';
import { CommonModule } from '@angular/common';
import { NewSpecieFormComponent } from '../../forms/newspecie-form/newspecie-form.component';

@Component({
  selector: 'app-species-zone',
  standalone: true,
  imports: [CommonModule, NewSpecieFormComponent],
  templateUrl: './species-zone.component.html',
  styleUrl: './species-zone.component.css'
})
export class SpeciesZoneComponent implements OnInit, OnDestroy {
  recordedSpecies = signal<RercordedSpecies[]>([]);
  currentZone = signal<Zones | null>(null);
  loading = signal<boolean>(true);
  showNewSpeciesModal = false;
  showAddSpeciesModal = false;
  showEditSpeciesModal = false;
  selectedSpecies: RercordedSpecies | null = null;
  openMenuId: number | null = null;
  private paramSub!: Subscription;
  projectId: number = 0;
  zoneId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private speciesService: SpeciesService,
    private studyZoneService: StudyZoneService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const projectId = +params.get('id')!;
      const zoneId = +params.get('zoneId')!;
      
      if (projectId && zoneId) {
        this.projectId = projectId;
        this.zoneId = zoneId;
        this.loadZoneInfo(zoneId);
        this.loadSpecies(zoneId);
      }
    });
  }

  loadZoneInfo(zoneId: number): void {
    this.studyZoneService.getStudyZoneById(zoneId).subscribe({
      next: (zone: Zones) => {
        this.currentZone.set(zone);
      },
      error: (err: any) => {}
    });
  }

  loadSpecies(zoneId: number): void {
    this.loading.set(true);

    this.speciesService.getSpeciesByZone(zoneId).subscribe({
      next: (species: RercordedSpecies[]) => {
        this.recordedSpecies.set(species);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
      }
    });
  }

  openNewSpeciesModal(): void {
    this.selectedSpecies = null;
    this.showNewSpeciesModal = true;
    this.showAddSpeciesModal = true;
  }

  openAddSpeciesModal(): void {
    this.selectedSpecies = null;
    this.showAddSpeciesModal = true;
  }

  closeNewSpeciesModal(): void {
    this.showNewSpeciesModal = false;
    this.showAddSpeciesModal = false;
    this.selectedSpecies = null;
  }

  closeAddSpeciesModal(): void {
    this.showAddSpeciesModal = false;
    this.selectedSpecies = null;
  }

  openEditSpeciesModal(species: RercordedSpecies): void {
    this.selectedSpecies = species;
    this.showEditSpeciesModal = true;
  }

  closeEditSpeciesModal(): void {
    this.showEditSpeciesModal = false;
    this.selectedSpecies = null;
  }

  editSpecies(species: RercordedSpecies): void {
    this.selectedSpecies = species;
    this.showEditSpeciesModal = true;
  }

  onSpeciesCreated(newSpecies: RercordedSpecies): void {
    this.loadSpecies(this.zoneId);
  }

  onSpeciesUpdated(updated: RercordedSpecies): void {
    this.loadSpecies(this.zoneId);
  }

  deleteSpecies(speciesId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta especie?')) {
      this.speciesService.deleteSpeciesFromZone(this.zoneId, speciesId).subscribe({
        next: () => {
          this.loadSpecies(this.zoneId);
          this.openMenuId = null;
        },
        error: (err: any) => {
          alert('Error: ' + err.message);
        }
      });
    }
  }

  toggleMenu(speciesId: number): void {
    this.openMenuId = this.openMenuId === speciesId ? null : speciesId;
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