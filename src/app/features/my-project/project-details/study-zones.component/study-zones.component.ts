// study-zones.component.ts
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-study-zones',
  templateUrl: './study-zones.component.html',
  styleUrl: './study-zones.component.css',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkWithHref]
})
export class StudyZonesComponent implements OnInit, OnDestroy {
  project = signal<Project | null>(null);
  zones = signal<Project['zone']>([]);
  private paramSub!: Subscription;
  showGrid = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const idZone = +params.get('idZone')!;
      if (idZone) this.loadProject(idZone);
      this.setupRouteListener();
    });
  }

  private loadProject(idZone: number): void {
    this.projectService.getProjectById(idZone).subscribe({
      next: (data) => {
        this.project.set(data || null);
        this.zones.set(data?.zone ?? []);
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