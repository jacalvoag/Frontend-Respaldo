import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
=======
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
import { RercordedSpecies } from '../../../../core/models/recorded-species.model';
import { SpeciesService } from '../../../../core/services/species.service';
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
  @Input() speciesData: RercordedSpecies | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() speciesUpdated = new EventEmitter<{ id: number; data: any }>();

<<<<<<< HEAD
  speciesForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  zoneId: number = 0;

  imageUrl: string = '';
  imagePreview: string = '';
  uploading: boolean = false;
  uploadError: string = '';
=======
  speciesForm!: FormGroup;
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  imageUrl: string | null = null;
  uploading = false;
  uploadError: string | null = null;
  isEditMode = false;

  functionalTypes = [
    'Frutal',
    'Medicinal',
    'Ornamental',
    'Forestal',
    'Comestible',
    'Industrial'
  ];

  constructor(
<<<<<<< HEAD
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
=======
    private fb: FormBuilder,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    console.log('=== MODAL INICIALIZADO ===');
    console.log('show:', this.show);
    console.log('zoneId:', this.zoneId);
    console.log('speciesData:', this.speciesData);
    
    this.isEditMode = !!this.speciesData;
    this.initForm();

    if (this.speciesData) {
      this.loadSpeciesData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('=== MODAL CAMBIOS DETECTADOS ===');
    console.log('changes:', changes);
    
    if (changes['show'] && changes['show'].currentValue === true) {
      console.log('Modal abierto');
      
      // Si hay datos de especie, cargarlos
      if (this.speciesData && this.speciesForm) {
        this.loadSpeciesData();
      }
    }
    
    if (changes['speciesData'] && changes['speciesData'].currentValue) {
      console.log('Nuevos datos de especie:', changes['speciesData'].currentValue);
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
      this.isEditMode = true;
      if (this.speciesForm) {
        this.loadSpeciesData();
      }
    }
  }

<<<<<<< HEAD
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
=======
  private initForm(): void {
    this.speciesForm = this.fb.group({
      speciesName: ['', Validators.required],
      numberOfIndividuals: [1, [Validators.required, Validators.min(1)]],
      functionalType: ['', Validators.required],
      samplingUnit: ['', Validators.required],
      heightOrStratum: ['', Validators.required]
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
    });
  }

  private loadSpeciesData(): void {
    if (this.speciesData) {
      console.log('Cargando datos de especie al formulario:', this.speciesData);
      
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

<<<<<<< HEAD
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
=======
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'La imagen no debe superar los 5MB';
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Solo se permiten archivos de imagen';
        return;
      }

      this.selectedFile = file;
      this.uploadError = null;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // Subir automáticamente
      this.uploadImage();
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
    }
  }

async uploadImage(): Promise<void> {
  if (!this.selectedFile) return;

  this.uploading = true;
  this.uploadError = null;

  try {
    console.log('Subiendo imagen a Cloudinary...');
    
    // Convertir Observable a Promise usando lastValueFrom o suscripción
    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (url: string) => {
        console.log('Imagen subida exitosamente:', url);
        this.imageUrl = url;
        this.uploading = false;
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        this.uploadError = 'Error al subir la imagen. Intenta de nuevo.';
        this.imageUrl = null;
        this.uploading = false;
      }
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    this.uploadError = 'Error al subir la imagen. Intenta de nuevo.';
    this.imageUrl = null;
    this.uploading = false;
  }
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
    console.log('=== SUBMIT DEL FORMULARIO ===');
    console.log('Formulario válido:', this.speciesForm.valid);
    console.log('Valores del formulario:', this.speciesForm.value);

    // Marcar todos los campos como touched
    Object.keys(this.speciesForm.controls).forEach(key => {
      this.speciesForm.get(key)?.markAsTouched();
    });

    if (this.speciesForm.invalid) {
      console.error('Formulario inválido. Errores:');
      Object.keys(this.speciesForm.controls).forEach(key => {
        const control = this.speciesForm.get(key);
        if (control?.invalid) {
          console.error(`  - ${key}:`, control.errors, 'Valor:', control.value);
        }
      });
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.speciesForm.value;

    // Obtener el functionalTypeId basado en el nombre
    const functionalTypeId = this.getFunctionalTypeId(formValue.functionalType);

    if (!functionalTypeId) {
      alert('Error: Tipo funcional no válido');
      return;
    }

    if (this.isEditMode && this.speciesData) {
      // Modo EDICIÓN - PUT
      const updatePayload = {
        scientificName: formValue.speciesName, // Backend espera scientificName
        commonName: formValue.speciesName, // Usar el mismo valor
        quantity: parseInt(formValue.numberOfIndividuals),
        samplingUnit: formValue.samplingUnit,
        functionalTypeId: functionalTypeId,
        heightOrStratum: formValue.heightOrStratum,
        speciesPhoto: this.imageUrl || ''
      };

      console.log('Payload para actualizar especie (PUT):', updatePayload);
      
      this.speciesUpdated.emit({ 
        id: this.speciesData.speciesId, 
        data: updatePayload 
      });
    } else {
      const createPayload = {
        studyZoneId: this.zoneId,
        scientificName: formValue.speciesName, 
        commonName: formValue.speciesName, 
        quantity: parseInt(formValue.numberOfIndividuals),
        samplingUnit: formValue.samplingUnit,
        functionalTypeId: functionalTypeId,
        heightOrStratum: formValue.heightOrStratum,
        speciesPhoto: this.imageUrl || ''
      };

      console.log('Payload para crear especie (POST):', createPayload);
      console.log('Tipos de datos:', {
        studyZoneId: typeof createPayload.studyZoneId,
        quantity: typeof createPayload.quantity,
        functionalTypeId: typeof createPayload.functionalTypeId
      });
      
      this.save.emit(createPayload);
    }
  }

  private getFunctionalTypeId(functionalType: string): number | null {
    const typeMap: { [key: string]: number } = {
      'Frutal': 1,
      'Medicinal': 2,
      'Ornamental': 3,
      'Forestal': 4,
      'Comestible': 5,
      'Industrial': 6
    };

    return typeMap[functionalType] || null;
  }

  onClose(): void {
    console.log('Cerrando modal');
    this.speciesForm.reset({
      numberOfIndividuals: 1,
      functionalType: ''
    });
    this.removeImage();
    this.uploadError = null;
    this.close.emit();
  }
}