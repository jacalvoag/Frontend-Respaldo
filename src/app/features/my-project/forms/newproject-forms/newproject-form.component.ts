import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-newproject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newproject-form.component.html',
  styleUrls: ['./newproject-form.component.css']
})
export class NewProjectFormComponent implements OnInit {
  @Input() project: Project | null = null; // Para modo edición
  @Output() closeModal = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<any>();
  @Output() projectUpdated = new EventEmitter<any>();

  projectForm: FormGroup;
  isEditMode: boolean = false;

  constructor() {
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const newProject = {
        id: Date.now(), // ID temporal
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