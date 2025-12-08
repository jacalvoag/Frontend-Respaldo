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
  @Input() zone: Zones | null = null;
  @Input() projectId: number = 0;
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
      squareFootage: new FormControl('', [Validators.required, Validators.min(0.01)])
    });
  }

  ngOnInit(): void {
<<<<<<< HEAD
    // Obtener projectId de la ruta
    this.projectId = +this.route.snapshot.paramMap.get('id')!;

=======
    console.log('NewZoneFormComponent - projectId recibido:', this.projectId);
    console.log('NewZoneFormComponent - zone recibida:', this.zone);
    
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
    if (this.zone) {
      this.isEditMode = true;
      const areaValue = this.extractNumber(this.zone.squareFootage);
      
      this.zoneForm.patchValue({
        zoneName: this.zone.zoneName,
        zoneDescription: this.zone.zoneDescription,
        squareFootage: areaValue
      });
      
      console.log('Modo edicion activado para zona:', this.zone.idZone);
      console.log('Valores del formulario:', this.zoneForm.value);
    }
  }

  onSubmit(): void {
<<<<<<< HEAD
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
=======
    if (this.zoneForm.valid) {
      const squareArea = parseFloat(this.zoneForm.value.squareFootage);
      
      if (this.isEditMode && this.zone) {
        const updatePayload = {
          studyZoneName: this.zoneForm.value.zoneName,
          studyZoneDescription: this.zoneForm.value.zoneDescription || null,
          squareArea: squareArea
        };
        
        console.log('PUT - Enviando actualizacion de zona:', JSON.stringify(updatePayload, null, 2));
        this.zoneUpdated.emit({ id: this.zone.idZone, data: updatePayload });
        
      } else {
        if (!this.projectId) {
          console.error('Error: projectId no esta definido');
          alert('Error: No se puede crear la zona sin un proyecto asociado');
          return;
        }
        
        const createPayload = {
          projectId: this.projectId,
          studyZoneName: this.zoneForm.value.zoneName,
          studyZoneDescription: this.zoneForm.value.zoneDescription || null,
          squareArea: squareArea
        };
        
        console.log('POST - Enviando creacion de zona:', JSON.stringify(createPayload, null, 2));
        this.zoneCreated.emit(createPayload);
      }
      
      this.onClose();
    } else {
      console.error('Formulario invalido:', this.zoneForm.errors);
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
    }
  }

  private extractNumber(value: string): number {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  onClose(): void {
    this.closeModal.emit();
  }
}