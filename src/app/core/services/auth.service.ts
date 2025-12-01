import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const BASE_URL_AUTH = 'http://localhost:8080/api/auth'; 
const TOKEN_KEY = 'auth_token'; 

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    private saveToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }
    
    public getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    public isAuthenticated(): boolean {
        return !!this.getToken(); 
    }

    // POST /api/auth/login
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${BASE_URL_AUTH}/login`, credentials).pipe(
            tap(response => {
                this.saveToken(response.token);
            })
        );
    }

    register(userData: RegisterRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${BASE_URL_AUTH}/register`, userData).pipe(
            tap(response => {
                this.saveToken(response.token);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        this.router.navigate(['/auth/login']); 
    }
}