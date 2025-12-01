import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';

@Component({
  selector: 'app-newspecie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newspecie-form.component.html',
  styleUrls: ['./newspecie-form.component.css']
})
export class NewSpecieFormComponent implements OnInit {
  @Input() species: RercordedSpecies | null = null; 
  @Output() closeModal = new EventEmitter<void>();
  @Output() speciesCreated = new EventEmitter<RercordedSpecies>();
  @Output() speciesUpdated = new EventEmitter<RercordedSpecies>();

  speciesForm: FormGroup;
  isEditMode: boolean = false;

  functionalTypes = [
    'Frutal',
    'Medicinal',
    'Ornamental',
    'Forestal',
    'Comestible',
    'Industrial'
  ];

  constructor() {
    this.speciesForm = new FormGroup({
      speciesName: new FormControl('', [Validators.required]),
      samplingUnit: new FormControl('', [Validators.required]),
      functionalType: new FormControl('', [Validators.required]),
      numberOfIndividuals: new FormControl('', [Validators.required, Validators.min(1)]),
      heightOrStratum: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.species) {
      this.isEditMode = true;
      this.speciesForm.patchValue({
        speciesName: this.species.speciesName,
        samplingUnit: this.species.samplingUnit,
        functionalType: this.species.functionalType,
        numberOfIndividuals: this.species.numberOfIndividuals,
        heightOrStratum: this.species.heightOrStratum
      });
    }
  }

  onSubmit(): void {
    if (this.speciesForm.valid) {
      if (this.isEditMode && this.species) {
        const updatedSpecies: RercordedSpecies = {
          ...this.species,
          speciesName: this.speciesForm.value.speciesName,
          samplingUnit: this.speciesForm.value.samplingUnit,
          functionalType: this.speciesForm.value.functionalType,
          numberOfIndividuals: this.speciesForm.value.numberOfIndividuals,
          heightOrStratum: this.speciesForm.value.heightOrStratum
        };
        this.speciesUpdated.emit(updatedSpecies);
      } else {
        const newSpecies: RercordedSpecies = {
          speciesId: Date.now(), 
          speciesName: this.speciesForm.value.speciesName,
          samplingUnit: this.speciesForm.value.samplingUnit,
          functionalType: this.speciesForm.value.functionalType,
          numberOfIndividuals: this.speciesForm.value.numberOfIndividuals,
          heightOrStratum: this.speciesForm.value.heightOrStratum
        };
        this.speciesCreated.emit(newSpecies);
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