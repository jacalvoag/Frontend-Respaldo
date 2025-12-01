import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  @Output() zoneCreated = new EventEmitter<any>();
  @Output() zoneUpdated = new EventEmitter<any>();

  zoneForm: FormGroup;
  isEditMode: boolean = false;

  constructor() {
    this.zoneForm = new FormGroup({
      zoneName: new FormControl('', [Validators.required]),
      zoneDescription: new FormControl(''),
      squareFootage: new FormControl('', [Validators.required, Validators.min(0.01)])
    });
  }

  ngOnInit(): void {
    console.log('NewZoneFormComponent - projectId recibido:', this.projectId);
    console.log('NewZoneFormComponent - zone recibida:', this.zone);
    
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