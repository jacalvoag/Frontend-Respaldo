import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RercordedSpecies } from '../models/recorded-species.model';

const BASE_URL = `${environment.apiUrl}`;

interface BackendSpeciesDetail {
  speciesId: number;
  scientificName: string;
  commonName?: string;
  quantity: number;
  samplingUnit?: string;
  functionalType?: string;
  heightOrStratum?: string;
  observations?: string;
  speciesPhoto?: string;
}

interface CreateSpeciesRequest {
  studyZoneId: number;
  scientificName: string;
  commonName?: string;
  quantity: number;
  samplingUnit?: string;
  functionalTypeId?: number;
  heightOrStratum?: string;
  observations?: string;
  speciesPhoto?: string;
}

interface UpdateSpeciesRequest {
  scientificName?: string;
  commonName?: string;
  quantity?: number;
  samplingUnit?: string;
  functionalTypeId?: number;
  heightOrStratum?: string;
  observations?: string;
  speciesPhoto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor(private http: HttpClient) { }

  getSpeciesByZone(zoneId: number): Observable<RercordedSpecies[]> {
    console.log('GET a /species-registry/zone/' + zoneId);
    
    return this.http.get<BackendSpeciesDetail[]>(`${BASE_URL}/species-registry/zone/${zoneId}`).pipe(
      map(backendSpecies => this.adaptBackendSpecies(backendSpecies)),
      tap(species => console.log('Especies obtenidas:', species.length)),
      catchError(this.handleError)
    );
  }

  createSpeciesInZone(zoneId: number, speciesData: any): Observable<RercordedSpecies> {
    console.log('POST a /species-registry/zone/' + zoneId);
    console.log('Payload:', JSON.stringify(speciesData, null, 2));
    
    return this.http.post<any>(`${BASE_URL}/species-registry/zone/${zoneId}`, speciesData).pipe(
      map(response => {
        if (response.species) {
          return this.adaptBackendSpeciesDetail(response.species);
        }
        return this.adaptBackendSpeciesDetail(response);
      }),
      tap(newSpecies => console.log('Especie creada:', newSpecies)),
      catchError(this.handleError)
    );
  }

  updateSpeciesInZone(zoneId: number, speciesId: number, speciesData: any): Observable<RercordedSpecies> {
    console.log('PUT a /species-registry/zone/' + zoneId + '/' + speciesId);
    console.log('Payload:', JSON.stringify(speciesData, null, 2));
    
    return this.http.put<any>(
      `${BASE_URL}/species-registry/zone/${zoneId}/${speciesId}`,
      speciesData
    ).pipe(
      map(response => {
        if (response.species) {
          return this.adaptBackendSpeciesDetail(response.species);
        }
        return this.adaptBackendSpeciesDetail(response);
      }),
      tap(updatedSpecies => console.log('Especie actualizada:', updatedSpecies)),
      catchError(this.handleError)
    );
  }

  deleteSpeciesFromZone(zoneId: number, speciesId: number): Observable<void> {
    console.log('DELETE a /species-registry/zone/' + zoneId + '/' + speciesId);
    
    return this.http.delete<void>(`${BASE_URL}/species-registry/zone/${zoneId}/${speciesId}`).pipe(
      tap(() => console.log('Especie eliminada:', speciesId)),
      catchError(this.handleError)
    );
  }

  private adaptBackendSpeciesDetail(backendSpecies: any): RercordedSpecies {
    return {
      speciesId: backendSpecies.speciesId,
      speciesName: backendSpecies.commonName || backendSpecies.scientificName,
      samplingUnit: backendSpecies.samplingUnit || '',
      functionalType: backendSpecies.functionalTypeName || backendSpecies.functionalType || '',
      numberOfIndividuals: backendSpecies.quantity?.toString() || backendSpecies.individualCount?.toString() || '0',
      heightOrStratum: backendSpecies.heightOrStratum || backendSpecies.heightStratum || '',
      speciesPhoto: backendSpecies.speciesPhoto
    };
  }

  private adaptBackendSpecies(backendSpecies: any[]): RercordedSpecies[] {
    return backendSpecies.map(s => this.adaptBackendSpeciesDetail(s));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrio un error desconocido';

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
        errorMessage = `Codigo: ${error.status} - ${error.statusText}`;
      }
    }

    console.error('Error en SpeciesService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}