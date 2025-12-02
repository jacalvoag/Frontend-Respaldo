// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';
import { PasswordChange, User } from '../models/user.model';

const BASE_URL = `${environment.apiUrl}/configuration`; 

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { } 

    getUserProfile(): Observable<any> {
        const userId = this.getUserIdFromStorage();
        return this.http.get<any>(`${BASE_URL}/${userId}`);
    }

    updateUserProfile(user: User): Observable<User> {
        const userId = this.getUserIdFromStorage();
        return this.http.put<User>(`${BASE_URL}/${userId}`, user); 
    }

    changePassword(passwordData: PasswordChange): Observable<boolean> {
        const userId = this.getUserIdFromStorage();
        console.log('Llamada a API: cambiar contraseña');
        return this.http.put<boolean>(`${BASE_URL}/${userId}`, passwordData);
    }

    changeEmail(newEmail: string): Observable<User> {
        const userId = this.getUserIdFromStorage();
        console.log('Llamada a API: cambiar email');
        const body = { userEmail: newEmail }; 
        return this.http.put<User>(`${BASE_URL}/${userId}`, body);
    }

    deleteAccount(): Observable<boolean> {
        const userId = this.getUserIdFromStorage();
        console.log('Llamada a API: eliminar cuenta');
        return this.http.delete<boolean>(`${BASE_URL}/${userId}`);
    }

    deactivateAccount(): Observable<boolean> {
        return this.deleteAccount();
    }

    private getUserIdFromStorage(): number {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            throw new Error('Usuario no autenticado');
        }
        return parseInt(userId);
    }
}