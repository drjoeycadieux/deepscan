'use server';

/**
 * @fileOverview Detects bugs in the given code with the help of AI.
 *
 * - detectBugs - A function that handles the bug detection process.
 * - DetectBugsInput - The input type for the detectBugs function.
 * - DetectBugsOutput - The return type for the detectBugs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBugsInputSchema = z.object({
  code: z.string().describe('The code to analyze for bugs.'),
});
export type DetectBugsInput = z.infer<typeof DetectBugsInputSchema>;

const DetectBugsOutputSchema = z.object({
  bugs: z.array(
    z.object({
      description: z.string().describe('Description of the bug.'),
      location: z.string().describe('The location of the bug in the code.'),
      severity: z.string().describe('The severity of the bug.'),
      suggestion: z.string().describe('Suggestion on how to fix the bug.'),
    })
  ).describe('List of bugs found in the code.'),
});
export type DetectBugsOutput = z.infer<typeof DetectBugsOutputSchema>;

export async function detectBugs(input: DetectBugsInput): Promise<DetectBugsOutput> {
  return detectBugsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectBugsPrompt',
  input: {schema: DetectBugsInputSchema},
  output: {schema: DetectBugsOutputSchema},
  prompt: `You are an AI code analyzer that detects bugs in the given code.\\n\\nAnalyze the following code for potential bugs and security vulnerabilities. Provide a detailed description of each bug, its location in the code, its severity (High, Medium, Low), and a suggestion on how to fix it.\\n\\nCode:\\n\`\`\`\\n{{{code}}}\\n\`\`\`\\n\\nOutput the bugs in JSON format.  Each bug should have a description, location, severity, and suggestion.`,
});

const detectBugsFlow = ai.defineFlow(
  {
    name: 'detectBugsFlow',
    inputSchema: DetectBugsInputSchema,
    outputSchema: DetectBugsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
