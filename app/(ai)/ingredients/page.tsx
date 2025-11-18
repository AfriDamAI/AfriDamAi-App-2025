"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IngredientAnalyzer from "@/components/ingredient-analyzer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function IngredientsPage() {
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the ingredient analyzer
          </p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ingredient Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste product ingredients to get AI-powered analysis of irritants,
            allergens, and skin compatibility
          </p>
        </div>

        <IngredientAnalyzer onAnalysisComplete={setAnalysisResults} />

        {analysisResults && (
          <div className="mt-8">
            <Link href="/scan">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Back to Skin Scan
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
