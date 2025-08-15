import { Suspense } from 'react';
import { analyzeCode } from '@/lib/analysis';
import { CodeForm } from '@/components/deep-scan/code-form';
import { ResultsDisplay } from '@/components/deep-scan/results-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Eye, ShieldCheck, Zap } from 'lucide-react';

function AboutSection() {
  const features = [
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: 'Comprehensive Bug Detection',
      description: 'Our AI meticulously scans your code to identify a wide range of bugs, from simple syntax errors to complex logic flaws, helping you improve code quality and reliability.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Advanced Security Scanning',
      description: 'We check for common security vulnerabilities like SQL injection, XSS, and more, providing actionable recommendations to keep your application secure.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Performance Optimization',
      description: 'Receive intelligent suggestions to refactor your code for better performance and readability, ensuring your application runs efficiently.',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline">Why Deep Scan?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Deep Scan leverages the power of generative AI to provide developers with a comprehensive and intuitive code analysis experience. Our tool goes beyond traditional static analysis to offer deeper insights and actionable feedback.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg">
              <div className="flex justify-center items-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Deep Scan. All rights reserved.</p>
        <p className="mt-2">
          Powered by{' '}
          <a href="https://firebase.google.com/products/studio" target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:underline">
            Firebase Studio
          </a>
        </p>
      </div>
    </footer>
  );
}


export default async function Home({ searchParams }: { searchParams: { code?: string; language?: string } }) {
  const code = searchParams.code;
  const language = searchParams.language || 'javascript';

  return (
    <>
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
      <AboutSection />
      <Footer />
    </>
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
        <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-card/50">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground">Checking...</p>
        </div>
    );
}
