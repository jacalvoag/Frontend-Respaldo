import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Zones } from '../../../../core/models/zones.model';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { ProjectService } from '../../../../core/services/project.service';
import { SpeciesService } from '../../../../core/services/species.service';
import { NewSpecieFormComponent } from '../../forms/newspecie-form/newspecie-form.component';

@Component({
  selector: 'app-species-zone.component',
  standalone: true,
  imports: [CommonModule, RouterLink, NewSpecieFormComponent],
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
  zoneId: number = 0;
  projectId: number = 0;

  private paramSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private speciesService: SpeciesService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;
      this.zoneId = +params.get('idZone')!;

      this.loadZoneData(this.projectId, this.zoneId);
      this.loadSpeciesData(this.zoneId);
    });
  }

  private loadZoneData(projectId: number, zoneId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        if (data) {
          const zone = data.zone.find(z => z.idZone === zoneId);
          if (zone) {
            this.currentZone.set(zone);
          }
        }
      },
      error: (err) => {
        console.error('Error cargando zona:', err);
      }
    });
  }

  private loadSpeciesData(zoneId: number): void {
    this.loading.set(true);

    this.speciesService.getSpeciesByZone(zoneId).subscribe({
      next: (species: RercordedSpecies[]) => {
        this.recordedSpecies.set(species);
        this.loading.set(false);
        console.log('Especies cargadas:', species.length);
      },
      error: (err) => {
        console.error('Error cargando especies:', err);
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
    this.selectedSpecies = null;
    this.showAddSpeciesModal = true;
  }

  closeAddSpeciesModal(): void {
    this.showAddSpeciesModal = false;
    this.selectedSpecies = null;
  }

  onSpeciesCreated(newSpecies: RercordedSpecies): void {
    // Recargar las especies desde el servidor
    this.loadSpeciesData(this.zoneId);
    console.log('Nueva especie creada:', newSpecies);
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

  onSpeciesUpdated(updatedSpecies: RercordedSpecies): void {
    // Recargar las especies desde el servidor
    this.loadSpeciesData(this.zoneId);
    console.log('Especie actualizada:', updatedSpecies);
  }

  deleteSpecies(speciesId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta especie?')) {
      this.speciesService.deleteSpeciesFromZone(this.zoneId, speciesId).subscribe({
        next: () => {
          console.log('Especie eliminada');
          this.loadSpeciesData(this.zoneId);
          this.openMenuId = null;
        },
        error: (err) => {
          console.error('Error eliminando especie:', err);
          alert('Error: ' + err.message);
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