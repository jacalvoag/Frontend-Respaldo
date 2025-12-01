import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Zones } from '../../../../core/models/zones.model';
import { StudyZoneService } from '../../../../core/services/study-zone.service';

@Component({
  selector: 'app-newzone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newzone-form.component.html',
  styleUrls: ['./newzone-form.component.css']
})
export class NewZoneFormComponent implements OnInit {
  @Input() zone: Zones | null = null; // Para modo edición
  @Output() closeModal = new EventEmitter<void>();
  @Output() zoneCreated = new EventEmitter<Zones>();
  @Output() zoneUpdated = new EventEmitter<Zones>();

  zoneForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  projectId: number = 0;

  constructor(
    private studyZoneService: StudyZoneService,
    private route: ActivatedRoute
  ) {
    this.zoneForm = new FormGroup({
      zoneName: new FormControl('', [Validators.required]),
      zoneDescription: new FormControl(''),
      squareFootage: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Obtener projectId de la ruta
    this.projectId = +this.route.snapshot.paramMap.get('id')!;

    if (this.zone) {
      this.isEditMode = true;
      this.zoneForm.patchValue({
        zoneName: this.zone.zoneName,
        zoneDescription: this.zone.zoneDescription,
        squareFootage: this.zone.squareFootage
      });
    }
  }

  onSubmit(): void {
    if (this.zoneForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const zoneData: Partial<Zones> = {
        zoneName: this.zoneForm.value.zoneName,
        zoneDescription: this.zoneForm.value.zoneDescription || '',
        squareFootage: this.zoneForm.value.squareFootage
      };

      if (this.isEditMode && this.zone) {
        this.studyZoneService.updateStudyZone(this.zone.idZone, zoneData).subscribe({
          next: (updatedZone: Zones) => {
            console.log('Zona actualizada:', updatedZone);
            this.zoneUpdated.emit(updatedZone);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error actualizando zona:', err);
            alert('Error: ' + err.message);
            this.isSubmitting = false;
          }
        });
      } else {
        this.studyZoneService.createStudyZone(this.projectId, zoneData).subscribe({
          next: (newZone: Zones) => {
            console.log('Zona creada:', newZone);
            this.zoneCreated.emit(newZone);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error creando zona:', err);
            alert('Error: ' + err.message);
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}