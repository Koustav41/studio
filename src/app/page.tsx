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

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [recommendations, setRecommendations] = useState<
    RankedInternshipWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState(true);

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

  return (
    <ParallaxProvider>
      <div className="flex flex-col min-h-screen bg-background/80 backdrop-blur-sm">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
              <Card className="shadow-lg bg-card/80 backdrop-blur-lg border-white/20">
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
                  Your Top Recommendations
                </h2>
                {recommendations.length > 0 && (
                  <div className="text-sm font-medium text-primary">
                    Showing {recommendations.length} best matches
                  </div>
                )}
              </div>

              <motion.div
                className="space-y-4"
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
              >
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
                    <AlertTitle>An Error Occurred</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!isLoading &&
                  !error &&
                  recommendations.length === 0 &&
                  !isInitialState && (
                    <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/80 backdrop-blur-lg border-white/20">
                      <Image
                        src="https://picsum.photos/300/200"
                        data-ai-hint="empty state search"
                        alt="A magnifying glass over a blank paper"
                        width={300}
                        height={200}
                        className="w-48 h-auto mb-4 rounded-lg"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        No Matches Found
                      </h3>
                      <p className="text-muted-foreground">
                        We couldn't find any internships matching your profile. Try adjusting your skills or location.
                      </p>
                    </Card>
                  )}
                {isInitialState && (
                  <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/50 border-dashed">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Lightbulb className="w-16 h-16 text-primary mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                      Let's find your perfect internship!
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Fill out the form with your details, and our AI will suggest the best opportunities for you from the PM Internship Scheme.
                    </p>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </main>
        <footer className="py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; 2025 PM Internship Scheme. All rights reserved.
          </div>
        </footer>
      </div>
    </ParallaxProvider>
  );
}
