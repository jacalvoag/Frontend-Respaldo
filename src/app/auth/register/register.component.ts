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
    // Crear FormControls con validaciones
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

  // Método para verificar errores de cada campo
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  // Obtener mensaje de error específico
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
    
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
    
    // Validar que el formulario sea válido
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password.value !== this.confirmPassword.value) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    // Validar que la contraseña tenga al menos 8 caracteres (doble verificación)
    if (this.password.value.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    this.isLoading = true;

    // Convertir la fecha al formato YYYY-MM-DD que espera el backend
    const birthDate = new Date(this.birthDate.value);
    const formattedDate = birthDate.toISOString().split('T')[0];

    const registerData: RegisterRequest = {
      userName: this.name.value,
      userLastname: this.lastName.value,
      userBirthday: formattedDate,
      userEmail: this.email.value,
      userPassword: this.password.value
      // biography es opcional, no se incluye si no hay valor
    };

    console.log('📤 Enviando datos de registro:', {
      ...registerData,
      userPassword: '***' // No mostrar la contraseña en consola
    });

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.isLoading = false;
        
        // Mostrar mensaje de éxito
        alert('¡Registro exitoso! Redirigiendo al inicio...');
        
        // Redirigir a /home
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('❌ Error en el registro:', err);
        this.isLoading = false;
        
        // Extraer mensaje de error del backend
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

  // Método para navegar al login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}