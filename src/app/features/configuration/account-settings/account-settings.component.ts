import { Component, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  @Input() isEditMode = signal(false);
  @Output() editModeChange = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<void>();
  
  showDeleteModal = signal(false);
  accountForm: FormGroup;

  constructor(private userService: UserService) {
    this.accountForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      age: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)])
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.accountForm.disable();
  }

  loadUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.accountForm.patchValue({
          email: user.email,
          age: user.age || ''
        });
      },
      error: (err) => {
        console.error('Error cargando datos de usuario', err);
      }
    });
  }

  toggleEditMode(): void {
    const newMode = !this.isEditMode();
    this.isEditMode.set(newMode);
    this.editModeChange.emit(newMode);
    
    if (newMode) {
      this.accountForm.enable();
    } else {
      this.accountForm.disable();
    }
  }

  onChangePassword(): void {
    const newPassword = this.accountForm.get('newPassword')?.value;
    const confirmPassword = this.accountForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (newPassword && confirmPassword) {
      this.userService.changePassword({ newPassword, confirmPassword }).subscribe({
        next: () => {
          console.log('Contraseña cambiada');
          this.saveSuccess.emit();
          this.accountForm.patchValue({ newPassword: '', confirmPassword: '' });
        },
        error: (err) => {
          console.error('Error cambiando contraseña', err);
        }
      });
    }
  }

  onChangeEmail(): void {
    const newEmail = this.accountForm.get('email')?.value;
    if (newEmail) {
      this.userService.changeEmail(newEmail).subscribe({
        next: () => {
          console.log('Email cambiado');
          this.saveSuccess.emit();
        },
        error: (err) => {
          console.error('Error cambiando email', err);
        }
      });
    }
  }

  onSaveAccountSettings(): void {
    if (this.accountForm.valid) {
      const age = this.accountForm.get('age')?.value;
      
      this.userService.updateUserProfile({ id: 1, age } as User).subscribe({
        next: () => {
          console.log('Configuración guardada');
          this.saveSuccess.emit();
          this.isEditMode.set(false);
          this.editModeChange.emit(false);
          this.accountForm.disable();
        },
        error: (err) => {
          console.error('Error guardando configuración', err);
        }
      });
    }
  }

  onDeactivateAccount(): void {
    if (confirm('¿Estás seguro que deseas desactivar tu cuenta?')) {
      this.userService.deactivateAccount().subscribe({
        next: () => {
          console.log('Cuenta desactivada');
          alert('Cuenta desactivada exitosamente');
        },
        error: (err) => {
          console.error('Error desactivando cuenta', err);
        }
      });
    }
  }

  onDeleteAccount(): void {
    this.showDeleteModal.set(true);
  }

  confirmDeleteAccount(): void {
    this.userService.deleteAccount().subscribe({
      next: () => {
        console.log('Cuenta eliminada');
        alert('Cuenta eliminada exitosamente');
        this.showDeleteModal.set(false);
      },
      error: (err) => {
        console.error('Error eliminando cuenta', err);
      }
    });
  }

  cancelDeleteAccount(): void {
    this.showDeleteModal.set(false);
  }
}