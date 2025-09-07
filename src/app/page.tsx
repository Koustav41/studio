'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { InternshipForm } from '@/components/internship-form';
import { InternshipCard } from '@/components/internship-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Terminal } from 'lucide-react';
import type { RankedInternshipWithDetails } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TranslationProvider,
  useTranslation,
} from '@/hooks/use-translation';

function ParallaxProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage: `url(https://picsum.photos/seed/picsum/1920/1080)`,
          backgroundPosition: 'bottom',
          backgroundSize: 'cover',
          y: backgroundY,
        }}
        data-ai-hint="background texture"
      />
      {children}
    </div>
  );
}

function HomePageContent() {
  const [recommendations, setRecommendations] = useState<
    RankedInternshipWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState(true);

  const { t, loading: isTranslating } = useTranslation();

  const handleResults = (data: {
    internships?: RankedInternshipWithDetails[];
    error?: string;
  }) => {
    setIsLoading(false);
    setIsInitialState(false);
    if (data.error) {
      setError(data.error);
      setRecommendations([]);
    } else if (data.internships) {
      setRecommendations(data.internships);
      setError(null);
    }
  };

  const handleLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const initialElements = {
    'home-recommendations-title': 'Your Top Recommendations',
    'home-recommendations-matches': (count: number) =>
      `Showing ${count} best matches`,
    'home-error-title': 'An Error Occurred',
    'home-no-matches-title': 'No Matches Found',
    'home-no-matches-description':
      "We couldn't find any internships matching your profile. Try adjusting your skills or location.",
    'home-initial-title': "Let's find your perfect internship!",
    'home-initial-description':
      'Fill out the form with your details, and our AI will suggest the best opportunities for you from the PM Internship Scheme.',
  };

  useEffect(() => {
    Object.entries(initialElements).forEach(([key, value]) => {
      if (typeof value === 'function') {
        // We can't pre-translate functions with arguments, so we skip them.
        // They will be translated on-demand.
      } else {
        t(value, key);
      }
    });
  }, [t]);

  return (
    <ParallaxProvider>
      <div className="flex flex-col min-h-screen bg-background/80 backdrop-blur-sm">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <InternshipForm
                    onResults={handleResults}
                    onLoading={handleLoading}
                    isSubmitting={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-foreground/90 font-headline">
                  {isTranslating && !t('home-recommendations-title') ? (
                    <Skeleton className="h-9 w-72" />
                  ) : (
                    t('home-recommendations-title')
                  )}
                </h2>
                {recommendations.length > 0 && (
                  <div className="text-sm font-medium text-primary">
                    {t('home-recommendations-matches', {
                      count: recommendations.length,
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6 flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {!isLoading &&
                  !error &&
                  recommendations.length > 0 &&
                  recommendations.map((internship) => (
                    <InternshipCard
                      key={internship.title}
                      internship={internship}
                    />
                  ))}
                {!isLoading && error && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{t('home-error-title')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!isLoading &&
                  !error &&
                  recommendations.length === 0 &&
                  !isInitialState && (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                      <Image
                        src="https://picsum.photos/300/200"
                        data-ai-hint="empty state search"
                        alt="A magnifying glass over a blank paper"
                        width={300}
                        height={200}
                        className="w-48 h-auto mb-4 rounded-lg"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {t('home-no-matches-title')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('home-no-matches-description')}
                      </p>
                    </Card>
                  )}
                {isInitialState && (
                  <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/50 border-dashed">
                    <Lightbulb className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {isTranslating && !t('home-initial-title') ? (
                         <Skeleton className="h-7 w-80" />
                      ) : (
                        t('home-initial-title')
                      )}
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      {isTranslating && !t('home-initial-description') ? (
                        <div className="space-y-2 mt-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-3/4" />
                        </div>
                      ) : (
                        t('home-initial-description')
                      )}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ParallaxProvider>
  );
}

export default function Home() {
  return (
    <TranslationProvider>
      <HomePageContent />
    </TranslationProvider>
  );
}
