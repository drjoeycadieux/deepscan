import type { AnalysisResults } from '@/lib/analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Bug, ShieldAlert, Rocket, ClipboardCheck, MapPin, Wand2 } from 'lucide-react';

export function ResultsDisplay({ results }: { results: AnalysisResults }) {
  const { bugs, vulnerabilities, optimizations, report } = results;

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 border-primary/50 shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-primary font-headline">
            <ClipboardCheck className="h-7 w-7" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-base leading-relaxed">{report.report}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="bugs" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="bugs" className="gap-2 py-2 sm:py-1.5">
            <Bug className="h-4 w-4" /> Bugs ({bugs.bugs.length})
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="gap-2 py-2 sm:py-1.5">
            <ShieldAlert className="h-4 w-4" /> Vulnerabilities ({vulnerabilities.vulnerabilities.length})
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="gap-2 py-2 sm:py-1.5">
            <Rocket className="h-4 w-4" /> Optimizations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bugs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {bugs.bugs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {bugs.bugs.map((bug, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-muted/30">
                        <div className="flex justify-between items-center w-full gap-4">
                          <span className="font-medium truncate">{bug.description}</span>
                          {getSeverityBadge(bug.severity)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-muted/20">
                        <div className="space-y-4">
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold mb-2 text-primary/90"><MapPin className="h-4 w-4" /> Location</h4>
                            <code className="font-code text-sm bg-background/50 rounded p-2 block overflow-x-auto">{bug.location}</code>
                          </div>
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold mb-2 text-primary/90"><Wand2 className="h-4 w-4" /> Suggestion</h4>
                            <p className="whitespace-pre-wrap">{bug.suggestion}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="p-6 text-muted-foreground">No bugs found. Great job!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="mt-6">
           <Card>
            <CardContent className="p-6">
                {vulnerabilities.vulnerabilities.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Identified Vulnerabilities</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {vulnerabilities.vulnerabilities.map((vuln, index) => (
                          <li key={index}>{vuln}</li>
                        ))}
                      </ul>
                    </div>
                     <div>
                      <h3 className="font-semibold text-lg mt-6 mb-3">Recommendations</h3>
                      <p className="whitespace-pre-wrap leading-relaxed">{vulnerabilities.recommendations}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No security vulnerabilities found. Keep it up!</p>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">{optimizations.suggestions}</div>
              {optimizations.referencesUsed && (
                <>
                  <h4 className="font-semibold mt-6 mb-2">References Used</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{optimizations.referencesUsed}</p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
