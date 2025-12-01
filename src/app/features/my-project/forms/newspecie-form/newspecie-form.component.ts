import { Component, Output, EventEmitter, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpeciesService } from '../../../../core/services/species.service';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-newspecie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newspecie-form.component.html',
  styleUrls: ['./newspecie-form.component.css']
})
export class NewSpecieFormComponent implements OnInit {
  @Input() species: RercordedSpecies | null = null;
  @Input() zoneId: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() speciesCreated = new EventEmitter<RercordedSpecies>();
  @Output() speciesUpdated = new EventEmitter<RercordedSpecies>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  speciesForm: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  imageUrl: string | null = null;
  imagePreview: string | null = null;
  uploading: boolean = false;
  uploadError: string | null = null;

  functionalTypes: string[] = [
  'Frutal',
  'Cerco vivo',
  'Maderable',
  'Medicinal',
  'Medicinal y plaguicida',
  'Ornamental',
  'Maderable y medicinal',
  'Frutal trepadora',
  'Medicinal y ornamental',
  'Medicinal y forrajero',
  'Frutal y forrajero'
  ];

  constructor(
    private speciesService: SpeciesService,
    private imageUploadService: ImageUploadService
  ) {
    this.speciesForm = new FormGroup({
      speciesName: new FormControl('', [Validators.required]),
      samplingUnit: new FormControl(''),
      functionalType: new FormControl(''),
      numberOfIndividuals: new FormControl('', [Validators.required]),
      heightOrStratum: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.species) {
      this.isEditMode = true;
      this.imageUrl = this.species.speciesPhoto || null;
      this.imagePreview = this.species.speciesPhoto || null;
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
    if (this.speciesForm.valid && this.zoneId && !this.isLoading) {
      this.isLoading = true;

      const speciesData: Partial<RercordedSpecies> = {
        speciesName: this.speciesForm.value.speciesName,
        samplingUnit: this.speciesForm.value.samplingUnit || '',
        functionalType: this.speciesForm.value.functionalType || '',
        numberOfIndividuals: this.speciesForm.value.numberOfIndividuals,
        heightOrStratum: this.speciesForm.value.heightOrStratum || '',
        speciesPhoto: this.imageUrl || undefined
      };

      if (this.isEditMode && this.species) {
        this.speciesService.updateSpeciesInZone(this.zoneId, this.species.speciesId, speciesData).subscribe({
          next: (updated: RercordedSpecies) => {
            this.speciesUpdated.emit(updated);
            this.isLoading = false;
            this.onClose();
          },
          error: (err: any) => {
            alert('Error: ' + err.message);
            this.isLoading = false;
          }
        });
      } else {
        this.speciesService.createSpeciesInZone(this.zoneId, speciesData).subscribe({
          next: (created: RercordedSpecies) => {
            this.speciesCreated.emit(created);
            this.isLoading = false;
            this.onClose();
          },
          error: (err: any) => {
            alert('Error: ' + err.message);
            this.isLoading = false;
          }
        });
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.uploadError = null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      this.imageUploadService.uploadImage(file).subscribe({
        next: (url: string) => {
          this.imageUrl = url;
          this.uploading = false;
        },
        error: (err: any) => {
          this.uploadError = err.message;
          this.uploading = false;
          this.imagePreview = null;
        }
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeImage(): void {
    this.imageUrl = null;
    this.imagePreview = null;
    this.uploadError = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}