// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Rutas públicas (sin autenticación)
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component')
            .then(m => m.LoginComponent),
        data: { title: 'Iniciar sesión' }
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component')
            .then(m => m.RegisterComponent),
        data: { title: 'Registro' }
    },
    {
        path: 'landing',
        loadComponent:() => import('./auth/landing/landing.component')
            .then(m => m.Landing),
        data: { title: 'Bienvenido a Sylvara' }
    },

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard], // 🔒 Proteger todas las rutas hijas
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/home/home.component')
                    .then(m => m.HomeComponent),
                data: { title: 'Home' }
            },
            {
                path: 'myprojects',
                loadComponent: () => import('./features/my-project/my-project.component')
                    .then(m => m.MyProjectComponent),
                data: { title: 'Mis proyectos' }
            },
            {
                path: 'myprojects/proyecto/:id',
                loadComponent: () => import('./features/my-project/project-details/project-information/project-information.component')
                    .then(m => m.ProjectDetailComponent),
                data: { title: 'Mis proyectos > [name_project]' }
            },
            {
                path: 'myprojects/proyecto/:id/zone/:idZone',
                loadComponent: () => import('./features/my-project/project-details/study-zones.component/study-zones.component')
                    .then(m => m.StudyZonesComponent),
                data: { title: 'Mis proyectos > [name_project] > [name_zone]' }
            },
            {
                path: 'myprojects/proyecto/:id/project-analysis',
                loadComponent: () => import('./features/my-project/project-details/biodiversity-analysis/biodiversity-analysis.component')
                    .then(m => m.BiodiversityAnalysisComponent),
                data: { title: 'Mis proyectos > [name_project]' }
            },
            {
                path: 'myprojects/proyecto/:id/zone/:idZone/species-zone',
                loadComponent: () => import('./features/my-project/project-details/species-zone/species-zone.component')
                    .then(m =>m.SpeciesZoneComponent),
                data: {title: 'Especies'}
            },
            {
                path: 'configuration',
                loadComponent: () => import('./features/configuration/configuration.component')
                    .then(m => m.ConfigurationModule),
                data: { title: 'Configuración' }
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', redirectTo: 'home' }   
        ]
    },

    // Redirección por defecto a landing si no está autenticado
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: '**', redirectTo: 'landing' }
];