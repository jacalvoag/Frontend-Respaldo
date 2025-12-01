// src/app/core/services/species.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RercordedSpecies } from '../models/recorded-species.model';

const BASE_URL = `${environment.apiUrl}`;

// ==================== BACKEND INTERFACES ====================
// Solo para comunicación con el backend, no se exportan
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

  // ==================== SPECIES CRUD ====================

  /**
   * GET /species-registry/zone/{zoneId}
   * Obtener todas las especies de una zona
   */
  getSpeciesByZone(zoneId: number): Observable<RercordedSpecies[]> {
    return this.http.get<BackendSpeciesDetail[]>(`${BASE_URL}/species-registry/zone/${zoneId}`).pipe(
      map(backendSpecies => this.adaptBackendSpecies(backendSpecies)),
      tap(species => console.log('✅ Especies obtenidas:', species.length)),
      catchError(this.handleError)
    );
  }

  /**
   * POST /species-registry/zone/{zoneId}
   * Crear especie en una zona
   */
  createSpeciesInZone(zoneId: number, species: Partial<RercordedSpecies>): Observable<RercordedSpecies> {
    const backendRequest: CreateSpeciesRequest = {
      studyZoneId: zoneId,
      scientificName: species.speciesName || '',
      commonName: species.speciesName || '',
      quantity: parseInt(species.numberOfIndividuals || '0'),
      samplingUnit: species.samplingUnit || '',
      heightOrStratum: species.heightOrStratum || '',
      observations: '',
      speciesPhoto: species.speciesPhoto
    };

    return this.http.post<BackendSpeciesDetail>(`${BASE_URL}/species-registry/zone/${zoneId}`, backendRequest).pipe(
      map(created => this.adaptBackendSpeciesDetail(created)),
      tap(newSpecies => console.log('✅ Especie creada:', newSpecies)),
      catchError(this.handleError)
    );
  }

  /**
   * PUT /species-registry/zone/{zoneId}/{speciesId}
   * Actualizar especie en una zona
   */
  updateSpeciesInZone(zoneId: number, speciesId: number, species: Partial<RercordedSpecies>): Observable<RercordedSpecies> {
    const updateRequest: UpdateSpeciesRequest = {
      scientificName: species.speciesName,
      commonName: species.speciesName,
      quantity: species.numberOfIndividuals ? parseInt(species.numberOfIndividuals) : undefined,
      samplingUnit: species.samplingUnit,
      heightOrStratum: species.heightOrStratum,
      speciesPhoto: species.speciesPhoto
    };

    return this.http.put<BackendSpeciesDetail>(
      `${BASE_URL}/species-registry/zone/${zoneId}/${speciesId}`,
      updateRequest
    ).pipe(
      map(updated => this.adaptBackendSpeciesDetail(updated)),
      tap(updatedSpecies => console.log('✅ Especie actualizada:', updatedSpecies)),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE /species-registry/zone/{zoneId}/{speciesId}
   * Eliminar especie de una zona
   */
  deleteSpeciesFromZone(zoneId: number, speciesId: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/species-registry/zone/${zoneId}/${speciesId}`).pipe(
      tap(() => console.log('✅ Especie eliminada:', speciesId)),
      catchError(this.handleError)
    );
  }

  // ==================== ADAPTADORES ====================

  /**
   * Convierte una especie del backend al formato del frontend
   */
  private adaptBackendSpeciesDetail(backendSpecies: BackendSpeciesDetail): RercordedSpecies {
    return {
      speciesId: backendSpecies.speciesId,
      speciesName: backendSpecies.commonName || backendSpecies.scientificName,
      samplingUnit: backendSpecies.samplingUnit || '',
      functionalType: backendSpecies.functionalType || '',
      numberOfIndividuals: backendSpecies.quantity.toString(),
      heightOrStratum: backendSpecies.heightOrStratum || '',
      speciesPhoto: backendSpecies.speciesPhoto
    };
  }

  /**
   * Convierte múltiples especies del backend al frontend
   */
  private adaptBackendSpecies(backendSpecies: BackendSpeciesDetail[]): RercordedSpecies[] {
    return backendSpecies.map(s => this.adaptBackendSpeciesDetail(s));
  }

  // ==================== HELPER METHODS ====================

  /**
   * Manejo centralizado de errores
   */
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

    console.error('❌ Error en SpeciesService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}