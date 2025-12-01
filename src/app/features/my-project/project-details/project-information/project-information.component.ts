import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkWithHref, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { filter } from 'rxjs';
import { NewProjectFormComponent } from '../../forms/newproject-forms/newproject-form.component';
import { NewZoneFormComponent } from '../../forms/newzone-form/newzone-form.component';
import { CommonModule } from '@angular/common';
import { Zones } from '../../../../core/models/zones.model';

@Component({
  selector: 'app-project-information',
  templateUrl: './project-information.component.html',
  styleUrl: './project-information.component.css',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkWithHref, NewProjectFormComponent, NewZoneFormComponent, CommonModule] 
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  info = signal<Project | null>(null);
  private paramSub!: Subscription;
  showGrid = true;
  showEditModal = false;
  showNewZoneModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.loadInfo(id);
      }
      this.setupRouteListener();
    });
  }

  loadInfo(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => 
        this.info.set(data || null),
      error: () => this.info.set(null)
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openNewZoneModal(): void {
    this.showNewZoneModal = true;
  }

  closeNewZoneModal(): void {
    this.showNewZoneModal = false;
  }

  onProjectUpdated(updatedProject: Project): void {
    this.info.set(updatedProject);
    console.log('Proyecto actualizado:', updatedProject);
  }

  onZoneCreated(newZone: Zones): void {
    const currentProject = this.info();
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        zone: [...currentProject.zone, newZone],
        numberOfZones: currentProject.zone.length + 1
      };
      this.info.set(updatedProject);
      console.log('Nueva zona creada:', newZone);
    }
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