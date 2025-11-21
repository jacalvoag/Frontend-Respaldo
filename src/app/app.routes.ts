// src/app/routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component/main-layout.component';

export const routes: Routes = [
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
        data: { title: 'Bienvenido a nuestra landing page' }
    },

    {
        path: '',
        component: MainLayoutComponent, 
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
            data: { title: 'Mis proyectos > Detalles del Proyecto' }
        },

        {
            path: 'myprojects/proyecto/:id/zone/:idZone',
            loadComponent: () => import('./features/my-project/project-details/study-zones.component/study-zones.component')
            .then(m => m.StudyZonesComponent),
            data: { title: 'Mis proyectos > Detalles del Proyecto' }
        },

        {
            path: 'myprojects/proyecto/:id/proyecto-analisis',
            loadComponent: () => import('./features/my-project/project-details/biodiversity-analysis/biodiversity-analysis.component')
            .then(m => m.BiodiversityAnalysisComponent),
            data: { title: 'Mis proyectos > Análisis de biodiversidad' }
        },

        {
            path: 'team-projects',
            loadComponent: () => import('./features/team-projects/team-projects.module')
            .then(m => m.TeamProjectsModule),
            data: { title: 'Colaboraciones' }
        },
        {
            path: 'reports',
            loadComponent: () => import('./features/reports/reports.module')
            .then(m => m.ReportsModule),
            data: { title: 'Reportes' }
        },
        {
            path: 'configuration',
            loadComponent: () => import('./features/configuration/configuration.component')
            .then(m => m.ConfigurationModule),
            data: { title: 'Configuración' }
        },

        { path: '',       redirectTo: 'home', pathMatch: 'full' },
        { path: '**',     redirectTo: 'home' }   
        ]
    }
];