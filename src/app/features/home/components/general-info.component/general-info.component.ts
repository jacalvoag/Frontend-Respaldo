import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralStats } from '../../../../core/models/stats.model';
import { StatsService } from '../../../../core/services/stats.service';

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

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getGeneralStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.loading = false;
      }
    });
  }
}