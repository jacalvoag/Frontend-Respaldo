// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register.component',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  name: FormControl;
  lastName: FormControl;
  birthDate: FormControl;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required, 
      Validators.minLength(8)
    ]);
    this.confirmPassword = new FormControl('', [Validators.required]);
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.birthDate = new FormControl('', [Validators.required]);
    
    this.loginForm = new FormGroup({
      email: this.email, 
      password: this.password,
      confirmPassword: this.confirmPassword,
      name: this.name, 
      lastName: this.lastName, 
      birthDate: this.birthDate
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (field === 'email' && control?.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    
    if (field === 'password') {
      if (control?.hasError('minlength')) {
        const minLength = control.errors?.['minlength'].requiredLength;
        return `La contraseña debe tener al menos ${minLength} caracteres`;
      }
    }
    
    return '';
  }

  handleSubmit(): void {
    this.errorMessage = null;
    
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
    
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    if (this.password.value !== this.confirmPassword.value) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    if (this.password.value.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    this.isLoading = true;

    const birthDate = new Date(this.birthDate.value);
    const formattedDate = birthDate.toISOString().split('T')[0];

    const registerData: RegisterRequest = {
      userName: this.name.value,
      userLastname: this.lastName.value,
      userBirthday: formattedDate,
      userEmail: this.email.value,
      userPassword: this.password.value
    };

    console.log('Enviando datos de registro:', {
      ...registerData,
      userPassword: '***'
    });

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        
        alert('¡Registro exitoso! Redirigiendo al inicio...');
        
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('❌ Error en el registro:', err);
        this.isLoading = false;
        
        let apiError = 'Error al registrar usuario. Intenta nuevamente.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            apiError = err.error;
          } else if (err.error.error) {
            apiError = err.error.error;
          } else if (err.error.message) {
            apiError = err.error.message;
          }
        } else if (err.message) {
          apiError = err.message;
        }
        
        this.errorMessage = apiError;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}