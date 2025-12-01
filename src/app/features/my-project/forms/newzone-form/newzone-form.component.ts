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
  @Input() zone: Zones | null = null; // Para modo edición
  @Output() closeModal = new EventEmitter<void>();
  @Output() zoneCreated = new EventEmitter<any>();
  @Output() zoneUpdated = new EventEmitter<any>();

  zoneForm: FormGroup;
  isEditMode: boolean = false;

  constructor() {
    this.zoneForm = new FormGroup({
      zoneName: new FormControl('', [Validators.required]),
      zoneDescription: new FormControl(''),
      squareFootage: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
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
    if (this.zoneForm.valid) {
      if (this.isEditMode && this.zone) {
        // Modo edición
        const updatedZone = {
          ...this.zone,
          zoneName: this.zoneForm.value.zoneName,
          zoneDescription: this.zoneForm.value.zoneDescription || '',
          squareFootage: this.zoneForm.value.squareFootage
        };
        this.zoneUpdated.emit(updatedZone);
      } else {
        // Modo creación
        const newZone = {
          idZone: Date.now(),
          zoneName: this.zoneForm.value.zoneName,
          zoneDescription: this.zoneForm.value.zoneDescription || '',
          zoneNumber: 0, // Se actualizará según el orden
          squareFootage: this.zoneForm.value.squareFootage,
          biodiversityAnalysis: {
            shannonWiener: 0,
            simpson: 0,
            margaleft: 0,
            pielou: 0
          },
          recordedSpecies: []
        };
        this.zoneCreated.emit(newZone);
      }
      this.onClose();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}