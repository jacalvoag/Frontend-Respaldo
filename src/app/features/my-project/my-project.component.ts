// my-project.component.ts
import { Component, OnInit } from '@angular/core';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { RouterOutlet, RouterLinkWithHref, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.css']
})
export class MyProjectComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  textError: string = '';
  openMenuId: number | null = null;
  showGrid = true; // 

  constructor(
    private projectService: ProjectService,
    private router: Router,        
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.setupRouteListener();
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
        this.textError = 'Los datos no se cargaron';
      }
    });
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.button-option')) {
      this.openMenuId = null;
    }
  }

  // ← NUEVO: Detecta si hay ruta hija activa
  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showGrid = !this.route.firstChild;
      });
  }
}