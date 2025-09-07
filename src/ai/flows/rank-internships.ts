'use server';

/**
 * @fileOverview Ranks internships based on candidate profile, skills, sector interests, and location.
 *
 * - rankInternships - A function that ranks internships.
 * - RankInternshipsInput - The input type for the rankInternships function.
 * - RankedInternship - The output type for the rankInternships function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankInternshipsInputSchema = z.object({
  education: z.string().describe('The candidate\'s education level.'),
  skills: z.array(z.string()).describe('The candidate\'s skills.'),
  sectorInterests: z.array(z.string()).describe('The candidate\'s preferred sectors.'),
  location: z.string().describe('The candidate\'s preferred location.'),
  internshipList: z.array(z.object({
    title: z.string().describe('The title of the internship.'),
    description: z.string().describe('A brief description of the internship.'),
    sector: z.string().describe('The sector of the internship.'),
    location: z.string().describe('The location of the internship.'),
    skillsRequired: z.array(z.string()).describe('The skills required for the internship')
  })).describe('A list of internships to rank.')
});

export type RankInternshipsInput = z.infer<typeof RankInternshipsInputSchema>;

const RankedInternshipSchema = z.object({
  title: z.string().describe('The title of the internship.'),
  rank: z.number().describe('The rank of the internship based on relevance to the candidate.'),
  reason: z.string().describe('The reason for the assigned rank.')
});

export type RankedInternship = z.infer<typeof RankedInternshipSchema>;


export async function rankInternships(input: RankInternshipsInput): Promise<RankedInternship[]> {
  return rankInternshipsFlow(input);
}

const rankInternshipsPrompt = ai.definePrompt({
  name: 'rankInternshipsPrompt',
  input: { schema: RankInternshipsInputSchema },
  output: { schema: z.array(RankedInternshipSchema) },
  prompt: `You are an AI assistant designed to rank internships based on a candidate's profile.

  The candidate has the following profile:
  - Education: {{{education}}}
  - Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Sector Interests: {{#each sectorInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Location: {{{location}}}

  Given the following list of internships:
  {{#each internshipList}}
  - Title: {{{title}}}, Description: {{{description}}}, Sector: {{{sector}}}, Location: {{{location}}}, Skills Required: {{#each skillsRequired}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/each}}

  Rank each internship based on its relevance to the candidate's profile, skills, sector interests, and location.
  Location should be prioritized highly. Provide a rank (higher is better) and a reason for the ranking.
  Return the results as a JSON array of RankedInternship objects.
  Make sure the output is a valid JSON.
  `,
});

const rankInternshipsFlow = ai.defineFlow(
  {
    name: 'rankInternshipsFlow',
    inputSchema: RankInternshipsInputSchema,
    outputSchema: z.array(RankedInternshipSchema),
  },
  async input => {
    const { output } = await rankInternshipsPrompt(input);
    return output!;
  }
);
