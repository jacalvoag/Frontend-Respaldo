import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {


    private mockProjects: Project[] = [
        {
            id: 1, name: 'Rancho Cuba Libre', numberOfZones: 12, status: 'Activo',
            description: 'Proyecto de la materia de Análisis de Especies de 4 semestre. Predio de aproximadamente 1680 metros cuadrados divididos en 4 zonas de estudio.',
            zone: [
                {
                    idZone: 1,
                    zoneName: 'Parcela El Roble',
                    zoneDescription: 'Zona de estudio número 1. Ubicada en la parte noroeste del predio y con una superficie de 420 metros cuadrados aproximadamente. Posee una elevación de terreno bastante homogénea.',
                    zoneNumber: 1,
                    squareFootage: '420m2',
                    biodiversityAnalysis: {
                        shannonWiener: 1.89,
                        simpson: 0.47,
                        margaleft: 6.12,
                        pielou: 3.78
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Mango',
                        samplingUnit: '10m^2',
                        functionalType: 'Frutal',
                        numberOfIndividuals: '13',
                        heightOrStratum: '10 - 40m',
                    }]
                }
            ]
        },
        {
            id: 2, name: 'Tomate Invernadero', numberOfZones: 2, status: 'Terminado',
            description: 'Proyecto de la materia de Análisis de Especies de 4 semestre. Predio de aproximadamente 1680 metros cuadrados divididos en 4 zonas de estudio.',
            zone: [
                {
                    idZone: 2,
                    zoneName: 'Parcela El Roble',
                    zoneDescription: 'Zona de estudio número 1. Ubicada en la parte noroeste del predio y con una superficie de 420 metros cuadrados aproximadamente. Posee una elevación de terreno bastante homogénea.',
                    zoneNumber: 1,
                    squareFootage: '420m2',
                    biodiversityAnalysis: {
                        shannonWiener: 1.89,
                        simpson: 0.47,
                        margaleft: 6.12,
                        pielou: 3.78
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Mango',
                        samplingUnit: '',
                        functionalType: '',
                        numberOfIndividuals: '',
                        heightOrStratum: '',
                    }]

                },
                {
                    idZone: 3,
                    zoneName: 'HOLA GGZ',
                    zoneDescription: 'SKIBIDIPARCELA. Ubicada en la parte noroeste del predio y con una superficie de 420 metros cuadrados aproximadamente. Posee una elevación de terreno bastante homogénea.',
                    zoneNumber: 2,
                    squareFootage: '420m2',
                    biodiversityAnalysis: {
                        shannonWiener: 1.89,
                        simpson: 0.47,
                        margaleft: 6.12,
                        pielou: 3.78
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Mango',
                        samplingUnit: '',
                        functionalType: '',
                        numberOfIndividuals: '',
                        heightOrStratum: '',
                    }]

                },

            ]
        },
        {
            id: 3, name: 'Frijol Secano 2024', numberOfZones: 20, status: 'Activo',
            description: 'Proyecto de la materia de Análisis de Especies de 4 semestre. Predio de aproximadamente 1680 metros cuadrados divididos en 4 zonas de estudio.',
            zone: [
                {
                    idZone: 4,
                    zoneName: 'Parcela El Roble',
                    zoneDescription: 'Zona de estudio número 1. Ubicada en la parte noroeste del predio y con una superficie de 420 metros cuadrados aproximadamente. Posee una elevación de terreno bastante homogénea.',
                    zoneNumber: 2,
                    squareFootage: '420m2',
                    biodiversityAnalysis: {
                        shannonWiener: 1.89,
                        simpson: 0.47,
                        margaleft: 6.12,
                        pielou: 3.78
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Mango',
                        samplingUnit: '',
                        functionalType: '',
                        numberOfIndividuals: '',
                        heightOrStratum: '',
                    }]

                }

            ]
        },
        {
            id: 5, name: 'Café Altura', numberOfZones: 15, status: 'Activo',
            description: 'Proyecto de la materia de Análisis de Especies de 4 semestre. Predio de aproximadamente 1680 metros cuadrados divididos en 4 zonas de estudio.',
            zone: [
                {
                    idZone: 5,
                    zoneName: 'Parcela El Roble',
                    zoneDescription: 'Zona de estudio número 1. Ubicada en la parte noroeste del predio y con una superficie de 420 metros cuadrados aproximadamente. Posee una elevación de terreno bastante homogénea.',
                    zoneNumber: 2,
                    squareFootage: '420m2',
                    biodiversityAnalysis: {
                        shannonWiener: 1.89,
                        simpson: 0.47,
                        margaleft: 6.12,
                        pielou: 3.78
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Mango',
                        samplingUnit: '',
                        functionalType: '',
                        numberOfIndividuals: '',
                        heightOrStratum: '',
                    }]

                }

            ]
        },
        {
            id: 6,
            name: 'Aguacate Orgánico',
            numberOfZones: 8,
            status: 'Activo',
            description: 'Proyecto de cultivo de aguacate orgánico con prácticas sustentables.',
            zone: [
                {
                    idZone: 6,
                    zoneName: 'Parcela Norte',
                    zoneDescription: 'Zona principal de cultivo.',
                    zoneNumber: 1,
                    squareFootage: '550m2',
                    biodiversityAnalysis: {
                        shannonWiener: 2.15,
                        simpson: 0.52,
                        margaleft: 7.20,
                        pielou: 4.10
                    },
                    recordedSpecies: [{
                        speciesId: 1,
                        speciesName: 'Aguacate',
                        samplingUnit: 'hola',
                        functionalType: '',
                        numberOfIndividuals: '',
                        heightOrStratum: '',
                    }]
                }
            ]
        },
    ];


    getProjects(): Observable<Project[]> {
        return of(this.mockProjects).pipe(
            delay(300)
        );
    }

    getProjectById(id: number): Observable<Project | undefined> {
        const project = this.mockProjects.find(p => p.id === id);
        return of(project).pipe(delay(200));
    }
}