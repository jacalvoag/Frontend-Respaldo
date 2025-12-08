import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AccountSettingsComponent],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationModule implements OnInit {
  activeSection = signal<'perfil' | 'ajuste'>('perfil');
  showSuccessMessage = signal(false);
  loading = signal(true);
  isEditMode = signal(false);
  profileForm: FormGroup;
  userId: number = 0;

  constructor(private userService: UserService) {
    this.profileForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      bio: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {
    this.userId = this.getUserIdFromStorage();
    this.loadUserProfile();
    this.profileForm.disable();
  }

  private getUserIdFromStorage(): number {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    return parseInt(userId);
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          fullName: user.fullName,
          bio: user.biography,
          email: user.email
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil de usuario', err);
        this.loading.set(false);
      }
    });
  }

  setActiveSection(section: 'perfil' | 'ajuste'): void {
    this.activeSection.set(section);
    this.isEditMode.set(false);
    this.profileForm.disable();
  }

  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
    if (this.isEditMode()) {
      this.profileForm.enable();
      this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable();
      this.loadUserProfile();
    }
  }

  onSaveChanges(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.getRawValue();
      const [firstName, ...lastNameParts] = formValue.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updatePayload = {
        userName: firstName,
        userLastname: lastName,
        biography: formValue.bio || null,
        userEmail: formValue.email,
        userBirthday: new Date().toISOString().split('T')[0],
        userPassword: 'unchanged'
      };

      this.userService.updateUserProfile(updatePayload as any).subscribe({
        next: () => {
          console.log('Perfil actualizado exitosamente');
          this.showSuccessMessage.set(true);
          setTimeout(() => this.showSuccessMessage.set(false), 3000);
          this.isEditMode.set(false);
          this.profileForm.disable();
          this.loadUserProfile();
        },
        error: (err) => {
          console.error('Error guardando cambios:', err);
          alert('Error al actualizar el perfil: ' + (err.message || 'Error desconocido'));
        }
      });
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  }

  onChangePhoto(): void {
    console.log('Cambiar foto');
  }

  onDeletePhoto(): void {
    console.log('Eliminar foto');
  }

  onEditModeChange(newMode: boolean): void {
    this.isEditMode.set(newMode);
  }

  onSaveSuccess(): void {
    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);
  }
}