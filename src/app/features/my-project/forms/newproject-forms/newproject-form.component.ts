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
  @Input() project: Project | null = null; 
  @Output() closeModal = new EventEmitter<void>();
<<<<<<< HEAD
  @Output() projectCreated = new EventEmitter<Project>();
  @Output() projectUpdated = new EventEmitter<Project>();
=======
  @Output() projectCreated = new EventEmitter<any>();
  @Output() projectUpdated = new EventEmitter<any>(); 
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d

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
      console.log('Modo edición activado para proyecto:', this.project.id);
    }
  }

  onSubmit(): void {
<<<<<<< HEAD
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
=======
    if (this.projectForm.valid) {
      const userId = this.getUserIdFromStorage();
      
      if (this.isEditMode && this.project) {
        const updatePayload = {
          projectId: this.project.id,
          userId: userId,
          projectName: this.projectForm.value.name,
          projectStatus: this.project.status === 'Terminado' ? 'completado' : 'activo',
          projectDescription: this.projectForm.value.description || null
        };
        
        console.log('📤 PUT - Enviando actualización:', JSON.stringify(updatePayload, null, 2));
        this.projectUpdated.emit({ id: this.project.id, data: updatePayload });
        
      } else {
        const createPayload = {
          userId: userId,
          projectName: this.projectForm.value.name,
          projectStatus: 'activo',
          projectDescription: this.projectForm.value.description || null
        };
        
        console.log('POST - Enviando creación:', JSON.stringify(createPayload, null, 2));
        this.projectCreated.emit(createPayload);
      }
      
      this.onClose();
>>>>>>> 525c9cbfcb9cb62662db30fdc49b171cd354c53d
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