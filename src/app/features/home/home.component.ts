import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { ActiveProjectsComponent } from './components/active-projects.component/active-projects.component';
import { GeneralInfoComponent } from './components/general-info.component/general-info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActiveProjectsComponent, GeneralInfoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.loading = false;
      }
    });
  }
}