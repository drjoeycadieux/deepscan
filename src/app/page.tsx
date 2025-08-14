import { Suspense } from 'react';
import { analyzeCode } from '@/lib/analysis';
import { CodeForm } from '@/components/deep-scan/code-form';
import { ResultsDisplay } from '@/components/deep-scan/results-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Home({ searchParams }: { searchParams: { code?: string; language?: string } }) {
  const code = searchParams.code;
  const language = searchParams.language || 'javascript';

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          Deep Scan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered partner for writing clean, secure, and optimized code. Paste your snippet, choose the language, and let our advanced analysis begin.
        </p>
      </header>
      
      <section className="max-w-4xl mx-auto">
        <CodeForm code={code} language={language} />
      </section>
      
      {code && (
        <section className="mt-12 max-w-6xl mx-auto">
          <Suspense fallback={<ResultsSkeleton />}>
            <AnalysisComponent code={code} language={language} />
          </Suspense>
        </section>
      )}
    </main>
  );
}

async function AnalysisComponent({ code, language }: { code: string; language: string }) {
  const results = await analyzeCode(code, language);
  if (!results) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Analysis Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>An error occurred while analyzing your code. This could be due to a network issue or an internal error. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  return <ResultsDisplay results={results} />;
}

function ResultsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                </CardContent>
            </Card>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
        </div>
    );
}
