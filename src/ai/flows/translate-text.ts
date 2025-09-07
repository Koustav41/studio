'use server';

/**
 * @fileOverview Translates text to a specified language.
 *
 * - translateText - A function that translates a batch of texts.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The output type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('The texts to translate.'),
  targetLanguage: z.string().describe('The language to translate the texts into (e.g., "Spanish", "Hindi").'),
});

export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
    translations: z.array(z.string()).describe('The translated texts.'),
});

export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following texts into {{targetLanguage}}. Return the translated texts in the same order.

Texts to translate:
{{#each texts}}
- "{{{this}}}"
{{/each}}

Provide only the translated texts in the response, formatted as a JSON object with a "translations" array.
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    if (input.texts.every(text => !text.trim())) {
      return { translations: input.texts };
    }
    const { output } = await translateTextPrompt(input);
    return output!;
  }
);
