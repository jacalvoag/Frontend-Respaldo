import { Zones } from "./zones.model";

export interface Project {
    id: number;
    name: string;
    numberOfZones: number;
    status: 'Activo' | 'Terminado';
    description: string;
    zone: Zones[]
}