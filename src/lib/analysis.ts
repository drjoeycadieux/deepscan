import { detectBugs, type DetectBugsOutput } from '@/ai/flows/detect-bugs';
import { scanVulnerabilities, type ScanVulnerabilitiesOutput } from '@/ai/flows/scan-vulnerabilities';
import { generateOptimizationSuggestions, type GenerateOptimizationSuggestionsOutput } from '@/ai/flows/generate-optimization-suggestions';
import { generateAnalysisReport, type GenerateAnalysisReportOutput } from '@/ai/flows/generate-analysis-report';

export interface AnalysisResults {
  bugs: DetectBugsOutput;
  vulnerabilities: ScanVulnerabilitiesOutput;
  optimizations: GenerateOptimizationSuggestionsOutput;
  report: GenerateAnalysisReportOutput;
}

export async function analyzeCode(code: string, language: string): Promise<AnalysisResults | null> {
  try {
    const [bugsResult, vulnerabilitiesResult, optimizationsResult] = await Promise.all([
      detectBugs({ code }),
      scanVulnerabilities({ code }),
      generateOptimizationSuggestions({ code, language }),
    ]);

    const reportInput = {
      code,
      bugs: JSON.stringify(bugsResult.bugs, null, 2),
      vulnerabilities: JSON.stringify(vulnerabilitiesResult.vulnerabilities, null, 2),
      optimizationSuggestions: optimizationsResult.suggestions,
    };

    const reportResult = await generateAnalysisReport(reportInput);

    return {
      bugs: bugsResult,
      vulnerabilities: vulnerabilitiesResult,
      optimizations: optimizationsResult,
      report: reportResult,
    };
  } catch (error) {
    console.error("Code analysis failed:", error);
    return null;
  }
}
