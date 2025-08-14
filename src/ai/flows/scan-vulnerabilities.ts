'use server';

/**
 * @fileOverview Security vulnerability scanning flow using AI.
 *
 * - scanVulnerabilities - Analyzes code for potential security vulnerabilities.
 * - ScanVulnerabilitiesInput - Input type for the scanVulnerabilities function.
 * - ScanVulnerabilitiesOutput - Return type for the scanVulnerabilities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanVulnerabilitiesInputSchema = z.object({
  code: z.string().describe('The code to be scanned for vulnerabilities.'),
});
export type ScanVulnerabilitiesInput = z.infer<typeof ScanVulnerabilitiesInputSchema>;

const ScanVulnerabilitiesOutputSchema = z.object({
  vulnerabilities: z
    .array(z.string())
    .describe('A list of security vulnerabilities found in the code.'),
  recommendations: z
    .string()
    .describe('Recommendations for fixing the identified vulnerabilities.'),
});
export type ScanVulnerabilitiesOutput = z.infer<typeof ScanVulnerabilitiesOutputSchema>;

export async function scanVulnerabilities(
  input: ScanVulnerabilitiesInput
): Promise<ScanVulnerabilitiesOutput> {
  return scanVulnerabilitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanVulnerabilitiesPrompt',
  input: {schema: ScanVulnerabilitiesInputSchema},
  output: {schema: ScanVulnerabilitiesOutputSchema},
  prompt: `You are a security expert tasked with identifying security vulnerabilities in code.

Analyze the following code for potential security issues, such as SQL injection, cross-site scripting (XSS), buffer overflows, and any other common vulnerabilities. Provide a list of vulnerabilities found and recommendations for fixing them.

Code:
\`\`\`
{{{code}}}
\`\`\`

Vulnerabilities:
{{{ vulnerabilities }}}
Recommendations:
{{{ recommendations }}}`,
});

const scanVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'scanVulnerabilitiesFlow',
    inputSchema: ScanVulnerabilitiesInputSchema,
    outputSchema: ScanVulnerabilitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
