import { Component, OnInit, OnDestroy, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { filter } from 'rxjs';
import { StudyZoneChartsComponent } from '../study-zone-charts/study-zone-charts.component';
import { Zones } from '../../../../core/models/zones.model';

@Component({
  selector: 'app-biodiversity-analysis',
  standalone: true,
  imports: [CommonModule, StudyZoneChartsComponent], // RouterLink
  templateUrl: './biodiversity-analysis.component.html',
  styleUrls: ['./biodiversity-analysis.component.css'],
})

export class BiodiversityAnalysisComponent implements OnInit, OnDestroy {
  info = signal<Project | null>(null);
  public zonesList = signal<Zones[]>([]);
  private paramSub!: Subscription;
  showGrid= true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  public transformAnalysisToChartData(analysis: Zones['biodiversityAnalysis']): any[] {
    return [
      { name: "S'", value: analysis.shannonWiener },
      { name: "D'", value: analysis.simpson },
      { name: "d", value: analysis.margaleft },
      { name: "J'", value: analysis.pielou }
    ];
  }

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.loadInfo(id);
        
      }
      this.setupRouteListener()
    });
  }

  loadInfo(id: number): void {
  this.projectService.getProjectById(id).subscribe({
    next: (data) => {
      this.info.set(data || null);
      
      // ✅ CAMBIO CLAVE: Asignar todas las zonas al signal zonesList
      if (data?.zone) {
        this.zonesList.set(data.zone);
      } else {
        this.zonesList.set([]);
      }
    },
    error: () => {
      this.info.set(null);
      this.zonesList.set([]); // Limpiar la lista de zonas en caso de error
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