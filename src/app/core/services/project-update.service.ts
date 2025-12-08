import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectUpdateService {
  private projectUpdated = new Subject<number>();
  private zoneUpdated = new Subject<{ projectId: number; zoneId: number }>();
  
  projectUpdated$ = this.projectUpdated.asObservable();
  zoneUpdated$ = this.zoneUpdated.asObservable();
  
  notifyProjectUpdate(projectId: number): void {
    this.projectUpdated.next(projectId);
  }
  
  notifyZoneUpdate(projectId: number, zoneId: number): void {
    this.zoneUpdated.next({ projectId, zoneId });
  }
}