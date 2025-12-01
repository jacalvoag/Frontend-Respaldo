import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudyZoneService } from '../../../../core/services/study-zone.service';
import { Zones } from '../../../../core/models/zones.model';

@Component({
  selector: 'app-newzone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newzone-form.component.html',
  styleUrls: ['./newzone-form.component.css']
})
export class NewZoneFormComponent implements OnInit {
  @Input() zone: Zones | null = null;
  @Input() projectId: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() zoneCreated = new EventEmitter<Zones>();
  @Output() zoneUpdated = new EventEmitter<Zones>();

  zoneForm: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(private studyZoneService: StudyZoneService) {
    this.zoneForm = new FormGroup({
      zoneName: new FormControl('', [Validators.required]),
      zoneDescription: new FormControl(''),
      squareFootage: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    console.log('NewZoneForm - projectId:', this.projectId);
    
    if (this.zone) {
      this.isEditMode = true;
      const areaValue = this.zone.squareFootage.replace(/[^\d.]/g, '');
      this.zoneForm.patchValue({
        zoneName: this.zone.zoneName,
        zoneDescription: this.zone.zoneDescription,
        squareFootage: areaValue
      });
    }
  }

  onSubmit(): void {
    console.log('=== DEBUG onSubmit ===');
    console.log('Form válido:', this.zoneForm.valid);
    console.log('projectId:', this.projectId);
    
    if (this.zoneForm.valid && this.projectId && !this.isLoading) {
      this.isLoading = true;

      const zoneData: Partial<Zones> = {
        zoneName: this.zoneForm.value.zoneName,
        zoneDescription: this.zoneForm.value.zoneDescription || '',
        squareFootage: `${this.zoneForm.value.squareFootage}m²`
      };

      console.log('Datos a enviar:', zoneData);

      if (this.isEditMode && this.zone) {
        console.log('Actualizando zona...');
        this.studyZoneService.updateStudyZone(this.zone.idZone, zoneData).subscribe({
          next: (updated: Zones) => {
            console.log('✅ Zona actualizada:', updated);
            this.zoneUpdated.emit(updated);
            this.isLoading = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
            this.isLoading = false;
          }
        });
      } else {
        console.log('Creando zona...');
        this.studyZoneService.createStudyZone(this.projectId, zoneData).subscribe({
          next: (created: Zones) => {
            console.log('✅ Zona creada:', created);
            this.zoneCreated.emit(created);
            this.isLoading = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
            this.isLoading = false;
          }
        });
      }
    } else {
      console.log('No se puede enviar:');
      console.log('- Form válido:', this.zoneForm.valid);
      console.log('- projectId:', this.projectId);
      console.log('- isLoading:', this.isLoading);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}