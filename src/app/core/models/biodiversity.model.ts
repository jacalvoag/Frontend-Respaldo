export interface BiodiversityIndices {
  shannonWiener: number | null;
  simpson: number | null;
  margalef: number | null;
  pielou: number | null;
}

export interface StudyZoneDetails {
  studyZoneId: number;
  projectId: number;
  studyZoneName: string;
  studyZoneDescription: string | null;
  squareArea: number;
  createdAt: string;
  biodiversityIndices: BiodiversityIndices;
}

export interface ZoneBiodiversity {
  studyZoneId: number;
  studyZoneName: string;
  squareArea: number;
  indices: BiodiversityIndices;
}

export interface BiodiversityAnalysis {
  zones: ZoneBiodiversity[];
}