import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Zones } from '../../../../core/models/zones.model';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-species-zone.component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './species-zone.component.html',
  styleUrl: './species-zone.component.css',
})
export class SpeciesZoneComponent implements OnInit, OnDestroy {
  currentZone = signal<Zones | null>(null);
  recordedSpecies = signal<RercordedSpecies[]>([]);
  loading = signal(true);
  openMenuId: number | null = null;

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
    console.log('Abrir modal para agregar especie');
  }

  editSpecies(species: RercordedSpecies): void {
    console.log('Editar especie:', species);

    this.openMenuId = null; 
  }

  deleteSpecies(speciesId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta especie?')) {
      console.log('Eliminar especie con ID:', speciesId);
      
      const updatedSpecies = this.recordedSpecies().filter(s => s.speciesId !== speciesId);
      this.recordedSpecies.set(updatedSpecies);
      this.openMenuId = null; // Cerrar el menú
    }
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}