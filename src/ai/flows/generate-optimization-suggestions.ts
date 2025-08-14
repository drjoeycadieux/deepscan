'use server';

/**
 * @fileOverview Generates suggestions for optimizing and refactoring code using AI.
 *
 * - generateOptimizationSuggestions - A function that handles the code optimization suggestions process.
 * - GenerateOptimizationSuggestionsInput - The input type for the generateOptimizationSuggestions function.
 * - GenerateOptimizationSuggestionsOutput - The return type for the generateOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimizationSuggestionsInputSchema = z.object({
  code: z
    .string()
    .describe('The code snippet to be optimized and refactored.'),
  language: z
    .string()
    .describe('The programming language of the code snippet.'),
});
export type GenerateOptimizationSuggestionsInput = z.infer<
  typeof GenerateOptimizationSuggestionsInputSchema
>;

const GenerateOptimizationSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-powered suggestions for optimizing and refactoring the code.'),
  referencesUsed: z
    .string()
    .optional()
    .describe(
      'Optional. Third-party references or resources used in the optimization suggestions, if any.'
    ),
});
export type GenerateOptimizationSuggestionsOutput = z.infer<
  typeof GenerateOptimizationSuggestionsOutputSchema
>;

export async function generateOptimizationSuggestions(
  input: GenerateOptimizationSuggestionsInput
): Promise<GenerateOptimizationSuggestionsOutput> {
  return generateOptimizationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOptimizationSuggestionsPrompt',
  input: {schema: GenerateOptimizationSuggestionsInputSchema},
  output: {schema: GenerateOptimizationSuggestionsOutputSchema},
  prompt: `You are an AI code optimization expert. Given the following code snippet and its language, provide suggestions for optimizing and refactoring the code to enhance its readability and performance.\n\nLanguage: {{{language}}}\nCode:\n{{{code}}}\n\nConsider best practices, performance improvements, and code clarity. If applicable, include third-party references that can aid in the optimization process.\n\nSuggestions:`, // Removed line breaks for better readability
});

const generateOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateOptimizationSuggestionsFlow',
    inputSchema: GenerateOptimizationSuggestionsInputSchema,
    outputSchema: GenerateOptimizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
