import { RercordedSpecies } from "./recorded-species.model";

export interface Zones{
    idZone: number,
    zoneName: string,
    zoneDescription: string,
    zoneNumber: number,
    squareFootage: string
    biodiversityAnalysis: {
        shannonWiener: number,
        simpson: number,
        margaleft: number,
        pielou: number
    };
    recordedSpecies: RercordedSpecies[]
}