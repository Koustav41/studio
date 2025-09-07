export type Internship = {
  title: string;
  description: string;
  sector: string;
  location: string;
  skillsRequired: string[];
};

export type RankedInternship = {
  title: string;
  rank: number;
  reason: string;
};

export type RankedInternshipWithDetails = Internship & RankedInternship;
