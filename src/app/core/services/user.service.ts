import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { delay } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http'; 
import { PasswordChange, User } from '../models/user.model';

const BASE_URL = 'http://localhost:8080/api/users'; 

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { } 

    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${BASE_URL}/profile`);
    }

    updateUserProfile(user: User): Observable<User> {
        return this.http.put<User>(`${BASE_URL}/profile`, user); 
    }

    changePassword(passwordData: PasswordChange): Observable<boolean> {
        console.log('Llamada a API: cambiar contraseña');
        return this.http.put<boolean>(`${BASE_URL}/config/password`, passwordData);
    }

    changeEmail(newEmail: string): Observable<User> {
        console.log('Llamada a API: cambiar email');
        const body = { newEmail: newEmail }; 
        return this.http.put<User>(`${BASE_URL}/config/email`, body);
    }

    deactivateAccount(): Observable<boolean> {
        console.log('Cuenta desactivada (MOCK)');
        return of(true).pipe(delay(500));
    }

    deleteAccount(): Observable<boolean> {
        console.log('Llamada a API: eliminar cuenta');
        return this.http.delete<boolean>(`${BASE_URL}/config/delete`);
    }
}