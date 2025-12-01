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

  constructor(private userService: UserService) {
    this.profileForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      bio: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.profileForm.disable();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          fullName: user.fullName,
          bio: user.bio,
          email: user.email,
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
    } else {
      this.profileForm.disable();
    }
  }

  onSaveChanges(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        id: 1,
        ...this.profileForm.value
      };

      this.userService.updateUserProfile(updatedUser).subscribe({
        next: (user) => {
          console.log('Cambios guardados:', user);
          this.showSuccessMessage.set(true);
          setTimeout(() => this.showSuccessMessage.set(false), 3000);
          this.isEditMode.set(false);
          this.profileForm.disable();
        },
        error: (err) => {
          console.error('Error guardando cambios', err);
        }
      });
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