import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private cloudName = 'do6tfi7ch'; 
  private uploadPreset = 'sylvara_species'; 
  private apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  private folder = 'sylvara/species';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    if (!this.isValidImageType(file)) {
      return throwError(() => new Error('Tipo de archivo no válido. Solo se permiten imágenes.'));
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return throwError(() => new Error('El archivo es demasiado grande. Máximo 5MB.'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.folder);

    return this.http.post<CloudinaryResponse>(this.apiUrl, formData).pipe(
      map(response => response.secure_url),
      catchError(error => {
        console.error('Error subiendo imagen a Cloudinary:', error);
        return throwError(() => new Error('Error al subir la imagen. Intenta nuevamente.'));
      })
    );
  }

  uploadMultipleImages(files: File[]): Observable<string[]> {
    const uploadObservables = files.map(file => this.uploadImage(file));
    
    // Esperar a que todas las imágenes se suban
    return new Observable(observer => {
      Promise.all(uploadObservables.map(obs => obs.toPromise()))
        .then(urls => {
          observer.next(urls.filter(url => url !== undefined) as string[]);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }


  private isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }


  getFileNameWithoutExtension(file: File): string {
    return file.name.split('.').slice(0, -1).join('.');
  }
}