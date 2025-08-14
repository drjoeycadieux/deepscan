'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating a comprehensive summary report of code analysis findings.
 *
 * @exports generateAnalysisReport - An async function that takes code analysis data and returns a summary report.
 * @exports GenerateAnalysisReportInput - The input type for the generateAnalysisReport function.
 * @exports GenerateAnalysisReportOutput - The output type for the generateAnalysisReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnalysisReportInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  bugs: z.string().describe('A list of bugs found in the code.'),
  vulnerabilities: z.string().describe('A list of security vulnerabilities found in the code.'),
  optimizationSuggestions: z
    .string()
    .describe('Suggestions for optimizing and refactoring the code.'),
});
export type GenerateAnalysisReportInput = z.infer<typeof GenerateAnalysisReportInputSchema>;

const GenerateAnalysisReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive summary report of the code analysis findings.'),
});
export type GenerateAnalysisReportOutput = z.infer<typeof GenerateAnalysisReportOutputSchema>;

export async function generateAnalysisReport(input: GenerateAnalysisReportInput): Promise<GenerateAnalysisReportOutput> {
  return generateAnalysisReportFlow(input);
}

const generateAnalysisReportPrompt = ai.definePrompt({
  name: 'generateAnalysisReportPrompt',
  input: {schema: GenerateAnalysisReportInputSchema},
  output: {schema: GenerateAnalysisReportOutputSchema},
  prompt: `You are an AI expert in code analysis and security.
  You are tasked with generating a comprehensive summary report of code analysis findings.
  The report should include a summary of the bugs, vulnerabilities, and optimization suggestions identified in the code.
  The report should be easy to understand and prioritize for resolution by a developer.

  Here is the code:
  {{code}}

  Here are the bugs found in the code:
  {{bugs}}

  Here are the security vulnerabilities found in the code:
  {{vulnerabilities}}

  Here are the suggestions for optimizing and refactoring the code:
  {{optimizationSuggestions}}

  Please generate a comprehensive summary report of the code analysis findings:
  `,
});

const generateAnalysisReportFlow = ai.defineFlow(
  {
    name: 'generateAnalysisReportFlow',
    inputSchema: GenerateAnalysisReportInputSchema,
    outputSchema: GenerateAnalysisReportOutputSchema,
  },
  async input => {
    const {output} = await generateAnalysisReportPrompt(input);
    return output!;
  }
);
