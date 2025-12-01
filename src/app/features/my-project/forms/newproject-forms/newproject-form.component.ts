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
  @Input() project: Project | null = null;
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
      const userId = this.getUserIdFromStorage();
      
      const projectPayload = {
        userId: userId,
        projectName: this.projectForm.value.name,
        projectStatus: 'activo',
        projectDescription: this.projectForm.value.description || null
      };
      
      console.log('📤 JSON enviado al backend:', JSON.stringify(projectPayload, null, 2));
      
      this.projectCreated.emit(projectPayload);
      this.onClose();
    }
  }

  private getUserIdFromStorage(): number {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('Usuario no autenticado. Por favor inicia sesión.');
    }
    return parseInt(userId);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}