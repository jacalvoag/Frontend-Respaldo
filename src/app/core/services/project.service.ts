// src/app/core/services/project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';
import { Zones } from '../models/zones.model';

const BASE_URL = `${environment.apiUrl}`;

interface BackendProject {
  projectId?: number;
  userId: number;
  projectName: string;
  projectStatus: 'activo' | 'inactivo' | 'completado';
  projectDescription?: string;
  createdAt?: string;
}

// ✅ Interface para el payload que enviamos al backend
interface CreateProjectPayload {
  userId: number;
  projectName: string;
  projectStatus: string;
  projectDescription: string | null;
}

interface HomeStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalStudyZones: number;
  totalSpecies: number;
  recentProjects: BackendProject[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  // ==================== PROJECT CRUD ====================

  getUserProjects(): Observable<Project[]> {
    const userId = this.getUserIdFromStorage();
    
    return this.http.get<BackendProject[]>(`${BASE_URL}/projects/user/${userId}`).pipe(
      map(backendProjects => this.adaptBackendProjects(backendProjects)),
      tap(projects => console.log('✅ Proyectos obtenidos:', projects.length)),
      catchError(this.handleError)
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<BackendProject>(`${BASE_URL}/projects/${id}`).pipe(
      map(backendProject => this.adaptBackendProject(backendProject)),
      tap(project => console.log('✅ Proyecto obtenido:', project.name)),
      catchError(this.handleError)
    );
  }

  /**
   * POST /projects - Crear nuevo proyecto
   * ✅ CORREGIDO: Envía el JSON exacto que espera el backend
   */
  createProject(projectPayload: CreateProjectPayload): Observable<Project> {
    console.log('📤 Enviando al backend:', JSON.stringify(projectPayload, null, 2));
    
    // ✅ Enviar directamente el payload sin transformaciones
    return this.http.post<BackendProject>(`${BASE_URL}/projects`, projectPayload).pipe(
      map(created => this.adaptBackendProject(created)),
      tap(newProject => console.log('✅ Proyecto creado:', newProject)),
      catchError(this.handleError)
    );
  }


updateProject(id: number, projectData: any): Observable<Project> {
  console.log('📤 PUT a /projects/' + id);
  console.log('📤 Payload que se enviará:', JSON.stringify(projectData, null, 2));
  
  const payload = {
    projectId: projectData.projectId || id,
    userId: projectData.userId,
    projectName: projectData.projectName,
    projectStatus: projectData.projectStatus,
    projectDescription: projectData.projectDescription
  };
  
  console.log('Payload final:', JSON.stringify(payload, null, 2));
  
  return this.http.put<BackendProject>(`${BASE_URL}/projects/${id}`, payload).pipe(
    map(updated => this.adaptBackendProject(updated)),
    tap(updatedProject => console.log('Proyecto actualizado:', updatedProject)),
    catchError(this.handleError)
  );
}

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/projects/${id}`).pipe(
      tap(() => console.log('Proyecto eliminado:', id)),
      catchError(this.handleError)
    );
  }

  // ==================== HOME STATS ====================

  getHomeStats(): Observable<HomeStats> {
    return this.http.get<HomeStats>(`${BASE_URL}/home`).pipe(
      tap(stats => console.log('✅ Estadísticas obtenidas:', stats)),
      catchError(this.handleError)
    );
  }

  // ==================== ADAPTADORES ====================

  private adaptBackendProject(backendProject: BackendProject): Project {
    return {
      id: backendProject.projectId || 0,
      name: backendProject.projectName,
      numberOfZones: 0,
      status: backendProject.projectStatus === 'completado' ? 'Terminado' : 'Activo',
      description: backendProject.projectDescription || '',
      zone: []
    };
  }

  private adaptBackendProjects(backendProjects: BackendProject[]): Project[] {
    return backendProjects.map(p => this.adaptBackendProject(p));
  }

  private getUserIdFromStorage(): number {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('Usuario no autenticado. Por favor inicia sesión.');
    }
    return parseInt(userId);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Código: ${error.status} - ${error.statusText}`;
      }
    }

    console.error('❌ Error en ProjectService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}