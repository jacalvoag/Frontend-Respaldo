export interface User {
    id: number;
    fullName: string;
    biography: string;
    email: string;
    age: number;
    
}

export interface PasswordChange {
    newPassword: string;
    confirmPassword: string;
}