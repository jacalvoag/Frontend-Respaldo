import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Zones } from '../../../../core/models/zones.model';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { ProjectService } from '../../../../core/services/project.service';
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

  private paramSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const projectId = +params.get('id')!;
      const zoneId = +params.get('idZone')!;

      this.loadSpeciesData(projectId, zoneId);
    });
  }

  private loadSpeciesData(projectId: number, zoneId: number): void {
    this.loading.set(true);

    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        if (data) {
          const zone = data.zone.find(z => z.idZone === zoneId);
          
          if (zone) {
            this.currentZone.set(zone);
            this.recordedSpecies.set(zone.recordedSpecies || []);
          }
        }
        
        this.loading.set(false);
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
    const currentSpecies = this.recordedSpecies();
    this.recordedSpecies.set([...currentSpecies, newSpecies]);
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
    const currentSpecies = this.recordedSpecies();
    const index = currentSpecies.findIndex(s => s.speciesId === updatedSpecies.speciesId);
    
    if (index !== -1) {
      const newSpecies = [...currentSpecies];
      newSpecies[index] = updatedSpecies;
      this.recordedSpecies.set(newSpecies);
      console.log('Especie actualizada:', updatedSpecies);
    }
  }

  deleteSpecies(speciesId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta especie?')) {
      console.log('Eliminar especie con ID:', speciesId);
      
      const updatedSpecies = this.recordedSpecies().filter(s => s.speciesId !== speciesId);
      this.recordedSpecies.set(updatedSpecies);
      this.openMenuId = null; 
    }
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}