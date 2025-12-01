import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { Zones } from '../../../../core/models/zones.model';
import { ProjectService } from '../../../../core/services/project.service';
import { StudyZoneChartsComponent } from '../study-zone-charts/study-zone-charts.components';
import { filter } from 'rxjs';
import { BiodiversityAnalysisComponent } from '../biodiversity-analysis/biodiversity-analysis.component';

@Component({
  selector: 'app-study-zones',
  templateUrl: './study-zones.component.html',
  styleUrl: './study-zones.component.css',
  standalone: true,
  imports: [CommonModule, StudyZoneChartsComponent, BiodiversityAnalysisComponent, RouterLink, RouterLinkWithHref] // RouterOutlet
})
export class StudyZonesComponent implements OnInit, OnDestroy {
  project = signal<Project | null>(null);
  zones = signal<Zones[]>([]); 
  private paramSub!: Subscription;
  showGrid = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const projectId = +params.get('id')!;  
      const zoneId = +params.get('idZone')!; 
      
      if (projectId && zoneId) {
        this.loadZone(projectId, zoneId);
      }
      this.setupRouteListener();
    });
  }

  private loadZone(projectId: number, zoneId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        this.project.set(data || null);
        
        if (data?.zone) {
          // const specificZone = data.zone.find(z => z.idZone === zoneId);
          //this.zones.set(specificZone ? [specificZone] : []);
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