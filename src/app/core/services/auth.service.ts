// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BASE_URL_AUTH = `${environment.apiUrl}/auth`; 
const TOKEN_KEY = 'auth_token'; 
const USER_ID_KEY = 'user_id';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    userLastname: string;
    userBirthday: string; 
    userEmail: string;
    userPassword: string;
    biography?: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    private saveToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private saveUserId(userId: number): void {
        localStorage.setItem(USER_ID_KEY, userId.toString());
    }
    
    public getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    public getUserId(): number | null {
        const id = localStorage.getItem(USER_ID_KEY);
        return id ? parseInt(id) : null;
    }

    public isAuthenticated(): boolean {
        return !!this.getToken(); 
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${BASE_URL_AUTH}/login`, credentials).pipe(
            tap(response => {
                console.log('Login exitoso, guardando token y userId');
                this.saveToken(response.token);
                this.saveUserId(response.userId);
            })
        );
    }

    register(userData: RegisterRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${BASE_URL_AUTH}/register`, userData).pipe(
            tap(response => {
                console.log('Registro exitoso, guardando token y userId');
                this.saveToken(response.token);
                this.saveUserId(response.userId);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        this.router.navigate(['/login']); 
    }
}