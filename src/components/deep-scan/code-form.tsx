"use client";

import { useFormStatus } from "react-dom";
import { ScanLine, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto font-semibold">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <ScanLine className="mr-2 h-5 w-5" />
          Scan Code
        </>
      )}
    </Button>
  );
}

export function CodeForm({ code, language }: { code?: string, language?: string }) {
    const supportedLanguages = ["javascript", "python", "typescript", "java", "csharp", "go", "ruby", "php", "html", "css"];
    return (
        <Card>
            <CardContent className="p-6">
                <form action="/" method="GET" className="space-y-6 w-full">
                    <div className="grid gap-2">
                        <Label htmlFor="code-input" className="text-base">Code Snippet</Label>
                        <Textarea
                            id="code-input"
                            name="code"
                            placeholder="Paste your code here..."
                            defaultValue={code || ""}
                            className="font-code min-h-[400px] text-sm bg-background border-border focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                        <div className="grid gap-2 w-full sm:w-64">
                            <Label htmlFor="language-select" className="text-base">Language</Label>
                            <Select name="language" defaultValue={language || "javascript"}>
                                <SelectTrigger id="language-select" className="bg-background">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supportedLanguages.map(lang => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
