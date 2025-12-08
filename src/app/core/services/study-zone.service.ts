import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Zones } from '../models/zones.model';
import { RercordedSpecies } from '../models/recorded-species.model';

const BASE_URL = `${environment.apiUrl}`;

interface BackendStudyZone {
  studyZoneId?: number;
  projectId: number;
  studyZoneName: string;
  studyZoneDescription?: string;
  squareArea: number;
  createdAt?: string;
}

interface BackendBiodiversityIndices {
  shannonWiener: number;
  simpson: number;
  margalef: number;
  pielou: number;
}

interface StudyZoneDetails {
  studyZone: BackendStudyZone;
  biodiversityIndices: BackendBiodiversityIndices;
  speciesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudyZoneService {

  constructor(private http: HttpClient) { }

  getStudyZonesByProject(projectId: number): Observable<Zones[]> {
    console.log('GET a /project-details/' + projectId + '/study-zones');
    
    return this.http.get<BackendStudyZone[]>(`${BASE_URL}/project-details/${projectId}/study-zones`).pipe(
      map(backendZones => this.adaptBackendZones(backendZones)),
      tap(zones => console.log('Zonas obtenidas:', zones.length)),
      catchError(this.handleError)
    );
  }

  getStudyZoneById(id: number): Observable<Zones> {
    return this.http.get<BackendStudyZone>(`${BASE_URL}/study-zones/${id}`).pipe(
      map(backendZone => this.adaptBackendZone(backendZone)),
      tap(zone => console.log('Zona obtenida:', zone.zoneName)),
      catchError(this.handleError)
    );
  }

createStudyZone(zonePayload: any): Observable<Zones> {
  const projectId = zonePayload.projectId;
  
  if (!projectId) {
    throw new Error('projectId es requerido para crear una zona');
  }
  
  console.log('POST a /project-details/' + projectId + '/study-zones');
  console.log('Payload:', JSON.stringify(zonePayload, null, 2));
  
  return this.http.post<BackendStudyZone>(
    `${BASE_URL}/project-details/${projectId}/study-zones`,
    zonePayload
  ).pipe(
    map(created => this.adaptBackendZone(created)),
    tap(newZone => console.log('Zona creada:', newZone)),
    catchError(this.handleError)
  );
}

updateStudyZone(zoneId: number, zonePayload: any): Observable<Zones> {
  console.log('PUT a /study-zone-details/' + zoneId);
  console.log('Payload:', JSON.stringify(zonePayload, null, 2));

  return this.http.put<BackendStudyZone>(`${BASE_URL}/study-zone-details/${zoneId}`, zonePayload).pipe(
    map(updated => this.adaptBackendZone(updated)),
    tap(updatedZone => console.log('Zona actualizada:', updatedZone)),
    catchError(this.handleError)
  );
}


  deleteStudyZone(projectId: number, zoneId: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/project-details/${projectId}/study-zones/${zoneId}`).pipe(
      tap(() => console.log('Zona eliminada:', zoneId)),
      catchError(this.handleError)
    );
  }


  getStudyZoneBiodiversity(zoneId: number): Observable<BackendBiodiversityIndices> {
    return this.http.get<StudyZoneDetails>(`${BASE_URL}/study-zone-details/${zoneId}/biodiversity`).pipe(
      map(details => details.biodiversityIndices),
      tap(indices => console.log('Índices de biodiversidad obtenidos:', indices)),
      catchError(this.handleError)
    );
  }

  private adaptBackendZone(backendZone: BackendStudyZone, index: number = 0): Zones {
    return {
      idZone: backendZone.studyZoneId || 0,
      zoneName: backendZone.studyZoneName,
      zoneDescription: backendZone.studyZoneDescription || '',
      zoneNumber: index + 1,
      squareFootage: `${backendZone.squareArea}m²`,
      biodiversityAnalysis: {
        shannonWiener: 0,
        simpson: 0,
        margaleft: 0,
        pielou: 0
      },
      recordedSpecies: []
    };
  }

  private adaptBackendZones(backendZones: BackendStudyZone[]): Zones[] {
    return backendZones.map((zone, index) => this.adaptBackendZone(zone, index));
  }

  private extractSquareArea(squareFootage: string): number {
    const match = squareFootage.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
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

    console.error('Error en StudyZoneService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}