export interface User {
    id: number;
    fullName: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    photoUrl?: string;
    age: number;
    
}

export interface PasswordChange {
    newPassword: string;
    confirmPassword: string;
}