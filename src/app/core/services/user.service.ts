import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PasswordChange, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private mockUser: User = {
        id: 1,
        fullName: 'María',
        bio: 'González',
        email: 'ariaria@gmail.com',
        phone: '961232323',
        location: 'La triste suchiapa',
        photoUrl: undefined,
        age: 28,    
    };
    // Este método simula una llamada a la API
    getUserProfile(): Observable<User> {
        return of(this.mockUser).pipe(delay(300));
    }

    // Simula actualizar el perfil del usuario
    updateUserProfile(user: User): Observable<User> {
        this.mockUser = { ...this.mockUser, ...user };
        return of(this.mockUser).pipe(delay(500));
    }

    // Simula cambiar la contraseña
    changePassword(passwordData: PasswordChange): Observable<boolean> {
        console.log('Cambio de contraseña simulado', passwordData);
        return of(true).pipe(delay(500));
    }

    // Simula cambiar el email
    changeEmail(newEmail: string): Observable<User> {
        this.mockUser.email = newEmail;
        return of(this.mockUser).pipe(delay(500));
    }

    // Simula desactivar la cuenta
    deactivateAccount(): Observable<boolean> {
        console.log('Cuenta desactivada');
        return of(true).pipe(delay(500));
    }

    // Simula eliminar la cuenta
    deleteAccount(): Observable<boolean> {
        console.log('Cuenta eliminada');
        return of(true).pipe(delay(500));
    }
}


