import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-newspecie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newspecie-form.component.html',
  styleUrl: './newspecie-form.component.css'
})
export class NewSpecieFormComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() zoneId!: number;
  @Input() projectId!: number;
  @Input() speciesData: RercordedSpecies | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() speciesUpdated = new EventEmitter<{ id: number; data: any }>();

  speciesForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  imageUrl: string | null = null;
  uploading = false;
  uploadError: string | null = null;
  isEditMode = false;

  functionalTypes = [
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
    private fb: FormBuilder,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.speciesData;
    this.initForm();

    if (this.speciesData) {
      this.loadSpeciesData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue === true) {
      if (this.speciesData && this.speciesForm) {
        this.loadSpeciesData();
      }
    }
    
    if (changes['speciesData'] && changes['speciesData'].currentValue) {
      this.isEditMode = true;
      if (this.speciesForm) {
        this.loadSpeciesData();
      }
    }
  }

  private initForm(): void {
    this.speciesForm = this.fb.group({
      speciesName: ['', Validators.required],
      numberOfIndividuals: [1, [Validators.required, Validators.min(1)]],
      functionalType: ['', Validators.required],
      samplingUnit: ['', Validators.required],
      heightOrStratum: ['', Validators.required]
    });
  }

  private loadSpeciesData(): void {
    if (this.speciesData) {
      this.speciesForm.patchValue({
        speciesName: this.speciesData.speciesName || '',
        numberOfIndividuals: parseInt(this.speciesData.numberOfIndividuals) || 1,
        functionalType: this.speciesData.functionalType || '',
        samplingUnit: this.speciesData.samplingUnit || '',
        heightOrStratum: this.speciesData.heightOrStratum || ''
      });

      if (this.speciesData.speciesPhoto) {
        this.imagePreview = this.speciesData.speciesPhoto;
        this.imageUrl = this.speciesData.speciesPhoto;
      }
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'La imagen no debe superar los 5MB';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Solo se permiten archivos de imagen';
        return;
      }

      this.selectedFile = file;
      this.uploadError = null;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadError = null;
    
    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (url: string) => {
        this.imageUrl = url;
        this.uploading = false;
      },
      error: (error) => {
        this.uploadError = 'Error al subir la imagen. Intenta de nuevo.';
        this.imageUrl = null;
        this.uploading = false;
      }
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imageUrl = null;
    this.uploadError = null;
    
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  onSubmit(): void {
    Object.keys(this.speciesForm.controls).forEach(key => {
      this.speciesForm.get(key)?.markAsTouched();
    });

    if (this.speciesForm.invalid) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.speciesForm.value;
    const functionalTypeId = this.getFunctionalTypeId(formValue.functionalType);

    if (!functionalTypeId) {
      alert('Error: Tipo funcional no válido');
      return;
    }

    if (this.isEditMode && this.speciesData) {
      const updatePayload = {
        projectId: this.projectId,
        speciesName: formValue.speciesName,
        speciesPhoto: this.imageUrl || '',
        functionalTypeId: functionalTypeId,
        studyZoneId: this.zoneId,
        samplingUnit: formValue.samplingUnit,
        individualCount: parseInt(formValue.numberOfIndividuals),
        heightStratum: formValue.heightOrStratum
      };
      
      this.speciesUpdated.emit({ 
        id: this.speciesData.speciesId, 
        data: updatePayload 
      });
    } else {
      const createPayload = {
        projectId: this.projectId,
        speciesName: formValue.speciesName,
        speciesPhoto: this.imageUrl || '',
        functionalTypeId: functionalTypeId,
        studyZoneId: this.zoneId,
        samplingUnit: formValue.samplingUnit,
        individualCount: parseInt(formValue.numberOfIndividuals),
        heightStratum: formValue.heightOrStratum
      };
      
      this.save.emit(createPayload);
    }
  }

  private getFunctionalTypeId(functionalType: string): number | null {
    const typeMap: { [key: string]: number } = {
      'Frutal': 1,
      'Cerco vivo': 2,
      'Maderable': 3,
      'Medicinal': 4,
      'Medicinal y plaguicida': 5,
      'Ornamental': 6,
      'Maderable y medicinal': 7,
      'Frutal trepadora': 8,
      'Medicinal y ornamental': 9,
      'Medicinal y forrajero': 10,
      'Frutal y forrajero': 11
    };
    return typeMap[functionalType] || null;
  }

  onClose(): void {
    this.speciesForm.reset({
      numberOfIndividuals: 1,
      functionalType: ''
    });
    this.removeImage();
    this.uploadError = null;
    this.close.emit();
  }
}