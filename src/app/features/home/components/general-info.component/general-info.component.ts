import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralStats } from '../../../../core/models/stats.model';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.css',
})
export class GeneralInfoComponent implements OnInit {
  stats: GeneralStats = {
    totalProjects: 0,
    projectsThisMonth: 0,
    totalAnalysis: 0,
    analysisThisMonth: 0
  };

  loading = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.projectService.getHomeStats().subscribe({
      next: (data: any) => {
        this.stats = {
          totalProjects: data.totalProjects || 0,
          projectsThisMonth: data.monthlyProjects || 0,
          totalAnalysis: data.totalAnalysis || 0,
          analysisThisMonth: data.analysisThisMonth || 0
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.loading = false;
      }
    });
  }
}