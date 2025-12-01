import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService, LoginRequest } from '../../core/services/auth.service'; 

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  errorMessage: string | null = null; 

  constructor(private authService: AuthService, private router: Router){ 

    this.email = new FormControl('')
    this.password = new FormControl('')
    this.loginForm = new FormGroup({email: this.email, password: this.password})

  }

  handleSubmit(): void{
    this.errorMessage = null; 
    
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente.';
      return;
    }

    const credentials: LoginRequest = {
        email: this.email.value, 
        password: this.password.value
    };

    this.authService.login(credentials) 
      .subscribe({
        next: (response) => {
          console.log('Login exitoso. Redirigiendo a /home');
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          console.error('Login fallido:', err);
          
          const apiError = err.error?.message || 'Correo o contraseña incorrectos.';

          this.errorMessage = apiError; 
        }
      });
  }


}