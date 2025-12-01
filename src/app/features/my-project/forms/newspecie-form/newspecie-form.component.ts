import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { SpeciesService } from '../../../../core/services/species.service';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-newspecie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newspecie-form.component.html',
  styleUrls: ['./newspecie-form.component.css']
})
export class NewSpecieFormComponent implements OnInit {
  @Input() species: RercordedSpecies | null = null; // Para modo edición
  @Output() closeModal = new EventEmitter<void>();
  @Output() speciesCreated = new EventEmitter<RercordedSpecies>();
  @Output() speciesUpdated = new EventEmitter<RercordedSpecies>();

  speciesForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  zoneId: number = 0;

  imageUrl: string = '';
  imagePreview: string = '';
  uploading: boolean = false;
  uploadError: string = '';
  selectedFile: File | null = null;

  functionalTypes = [
    'Frutal',
    'Medicinal',
    'Ornamental',
    'Forestal',
    'Comestible',
    'Industrial'
  ];

  constructor(
    private speciesService: SpeciesService,
    private imageUploadService: ImageUploadService,
    private route: ActivatedRoute
  ) {
    this.speciesForm = new FormGroup({
      speciesName: new FormControl('', [Validators.required]),
      samplingUnit: new FormControl('', [Validators.required]),
      functionalType: new FormControl('', [Validators.required]),
      numberOfIndividuals: new FormControl('', [Validators.required, Validators.min(1)]),
      heightOrStratum: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Obtener zoneId de la ruta
    this.zoneId = +this.route.snapshot.paramMap.get('idZone')!;

    if (this.species) {
      this.isEditMode = true;
      this.speciesForm.patchValue({
        speciesName: this.species.speciesName,
        samplingUnit: this.species.samplingUnit,
        functionalType: this.species.functionalType,
        numberOfIndividuals: this.species.numberOfIndividuals,
        heightOrStratum: this.species.heightOrStratum
      });

      if (this.species.speciesPhoto) {
        this.imageUrl = this.species.speciesPhoto;
        this.imagePreview = this.species.speciesPhoto;
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadError = '';

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadImageToCloud(file);
    }
  }

  uploadImageToCloud(file: File): void {
    this.uploading = true;
    this.uploadError = '';

    this.imageUploadService.uploadImage(file).subscribe({
      next: (url) => {
        this.imageUrl = url;
        this.uploading = false;
        console.log('Imagen subida exitosamente:', url);
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err);
        this.uploadError = err.message || 'Error al subir la imagen';
        this.uploading = false;
        this.imagePreview = '';
        this.selectedFile = null;
      }
    });
  }

  removeImage(): void {
    this.imageUrl = '';
    this.imagePreview = '';
    this.selectedFile = null;
    this.uploadError = '';
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput?.click();
  }

  onSubmit(): void {
    if (this.speciesForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const speciesData: Partial<RercordedSpecies> = {
        speciesName: this.speciesForm.value.speciesName,
        samplingUnit: this.speciesForm.value.samplingUnit,
        functionalType: this.speciesForm.value.functionalType,
        numberOfIndividuals: this.speciesForm.value.numberOfIndividuals,
        heightOrStratum: this.speciesForm.value.heightOrStratum,
        speciesPhoto: this.imageUrl || undefined
      };

      if (this.isEditMode && this.species) {
        this.speciesService.updateSpeciesInZone(this.zoneId, this.species.speciesId, speciesData).subscribe({
          next: (updatedSpecies: RercordedSpecies) => {
            console.log('Especie actualizada:', updatedSpecies);
            this.speciesUpdated.emit(updatedSpecies);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error actualizando especie:', err);
            alert('Error: ' + err.message);
            this.isSubmitting = false;
          }
        });
      } else {
        this.speciesService.createSpeciesInZone(this.zoneId, speciesData).subscribe({
          next: (newSpecies: RercordedSpecies) => {
            console.log('Especie creada:', newSpecies);
            this.speciesCreated.emit(newSpecies);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error creando especie:', err);
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

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}