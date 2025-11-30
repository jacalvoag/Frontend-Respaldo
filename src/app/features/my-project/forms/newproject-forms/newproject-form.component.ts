import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-newproject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newproject-form.component.html',
  styleUrls: ['./newproject-form.component.css']
})
export class NewProjectFormComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<any>();

  projectForm: FormGroup;

  constructor() {
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const newProject = {
        id: Date.now(),
        name: this.projectForm.value.name,
        description: this.projectForm.value.description || '',
        status: 'Activo' as 'Activo' | 'Terminado',
        numberOfZones: 0,
        zone: []
      };
      
      this.projectCreated.emit(newProject);
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