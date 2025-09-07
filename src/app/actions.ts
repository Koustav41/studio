'use server';

import { rankInternships, type RankInternshipsInput } from '@/ai/flows/rank-internships';
import { INTERNSHIPS } from '@/lib/constants';
import type { RankedInternshipWithDetails, Internship } from '@/lib/types';
import { translateText } from '@/ai/flows/translate-text';

export async function getRecommendedInternships(data: {
  education: string;
  skills: string[];
  sectorInterests: string[];
  location: string;
}): Promise<{
  internships?: RankedInternshipWithDetails[];
  error?: string;
}> {
  try {
    const rankInternshipsInput: RankInternshipsInput = {
      ...data,
      internshipList: INTERNSHIPS,
    };

    const rankedInternships = await rankInternships(rankInternshipsInput);

    const internshipMap = new Map<string, Internship>(
      INTERNSHIPS.map((i) => [i.title, i])
    );

    const recommendations: RankedInternshipWithDetails[] = rankedInternships
      .map((ranked) => {
        const details = internshipMap.get(ranked.title);
        if (!details) return null;
        return { ...details, ...ranked };
      })
      .filter((i): i is RankedInternshipWithDetails => i !== null)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 5);

    if (recommendations.length === 0) {
      return {
        error:
          'Could not find any matching recommendations. Please try adjusting your preferences.',
      };
    }

    return { internships: recommendations };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred while fetching recommendations.',
    };
  }
}

export async function translate(
  text: string,
  targetLanguage: string
): Promise<string> {
  return await translateText({ text, targetLanguage });
}
