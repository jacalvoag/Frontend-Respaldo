// src/app/features/my-project/project-details/biodiversity-analysis/biodiversity-analysis.component.ts
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { BiodiversityAnalysis, ZoneBiodiversity } from '../../../../core/models/biodiversity.model';
import { ProjectService } from '../../../../core/services/project.service';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { filter } from 'rxjs';
import { StudyZoneChartsComponent } from '../study-zone-charts/study-zone-charts.component';
import { Zones } from '../../../../core/models/zones.model';

@Component({
  selector: 'app-biodiversity-analysis',
  standalone: true,
  imports: [CommonModule, StudyZoneChartsComponent],
  templateUrl: './biodiversity-analysis.component.html',
  styleUrls: ['./biodiversity-analysis.component.css'],
})
export class BiodiversityAnalysisComponent implements OnInit, OnDestroy {
  info = signal<Project | null>(null);
  biodiversityAnalysis = signal<BiodiversityAnalysis | null>(null);
  public zonesList = signal<Zones[]>([]);
  loading = signal(true);
  private paramSub!: Subscription;
  showGrid = true;
  projectId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private studyZoneService: StudyZoneService
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
        this.projectId = id;
        this.loadInfo(id);
        this.loadBiodiversityAnalysis(id); 
      }
      this.setupRouteListener();
    });
  }

  loadInfo(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.info.set(data || null);
        
        if (data?.zone) {
          this.zonesList.set(data.zone);
        } else {
          this.zonesList.set([]);
        }
      },
      error: () => {
        this.info.set(null);
        this.zonesList.set([]);
      }
    });
  }

  loadBiodiversityAnalysis(projectId: number): void {
    this.loading.set(true);
    
    this.studyZoneService.getBiodiversityAnalysis(projectId).subscribe({
      next: (analysis) => {
        console.log('Análisis de biodiversidad cargado:', analysis);
        this.biodiversityAnalysis.set(analysis);
        
        const zonesWithIndices: Zones[] = analysis.zones.map(zoneBio => {

          const existingZone = this.zonesList().find(z => z.idZone === zoneBio.studyZoneId);
          
          return {
            idZone: zoneBio.studyZoneId,
            zoneName: zoneBio.studyZoneName,
            zoneDescription: existingZone?.zoneDescription || '',
            zoneNumber: existingZone?.zoneNumber || 0,
            squareFootage: `${zoneBio.squareArea}m²`,
            biodiversityAnalysis: {
              shannonWiener: zoneBio.indices.shannonWiener || 0,
              simpson: zoneBio.indices.simpson || 0,
              margaleft: zoneBio.indices.margalef || 0,
              pielou: zoneBio.indices.pielou || 0
            },
            recordedSpecies: existingZone?.recordedSpecies || []
          };
        });
        
        this.zonesList.set(zonesWithIndices);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando análisis de biodiversidad:', err);
        this.biodiversityAnalysis.set(null);
        this.loading.set(false);
      }
    });
  }

  formatIndex(value: number | null): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value.toFixed(4);
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