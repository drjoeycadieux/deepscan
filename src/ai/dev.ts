import { config } from 'dotenv';
config();

import '@/ai/flows/detect-bugs.ts';
import '@/ai/flows/generate-analysis-report.ts';
import '@/ai/flows/generate-optimization-suggestions.ts';
import '@/ai/flows/scan-vulnerabilities.ts';