import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';

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
  @Output() projectCreated = new EventEmitter<Project>();
  @Output() projectUpdated = new EventEmitter<Project>();

  projectForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(private projectService: ProjectService) {
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
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const projectData: Partial<Project> = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description
      };

      if (this.isEditMode && this.project) {
        this.projectService.updateProject(this.project.id, projectData).subscribe({
          next: (updatedProject: Project) => {
            console.log('Proyecto actualizado:', updatedProject);
            this.projectUpdated.emit(updatedProject);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error actualizando proyecto:', err);
            alert('Error: ' + err.message);
            this.isSubmitting = false;
          }
        });
      } else {
        this.projectService.createProject(projectData).subscribe({
          next: (newProject: Project) => {
            console.log('Proyecto creado:', newProject);
            this.projectCreated.emit(newProject);
            this.isSubmitting = false;
            this.onClose();
          },
          error: (err: any) => {
            console.error('Error creando proyecto:', err);
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
}