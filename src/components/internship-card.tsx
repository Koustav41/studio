import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { RankedInternshipWithDetails } from '@/lib/types';
import { ArrowRight, Briefcase, MapPin, Sparkles } from 'lucide-react';
import { SECTORS } from '@/lib/constants';
import { motion } from 'framer-motion';

type InternshipCardProps = {
  internship: RankedInternshipWithDetails;
};

const getSectorLabel = (sectorValue: string) => {
  return SECTORS.find((s) => s.value === sectorValue)?.label || sectorValue;
};

export function InternshipCard({ internship }: InternshipCardProps) {
  const getRankBadgeVariant = (rank: number) => {
    if (rank > 7) return 'default';
    if (rank > 4) return 'secondary';
    return 'outline';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Card className="transition-shadow duration-300 h-full flex flex-col justify-between">
        <div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-xl mb-1">
                  {internship.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{getSectorLabel(internship.sector)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{internship.location}</span>
                  </div>
                </div>
              </div>
              <Badge
                variant={getRankBadgeVariant(internship.rank)}
                className="whitespace-nowrap"
              >
                Rank: {internship.rank}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 mb-4">
              {internship.description}
            </p>
            <div className="flex items-start gap-3 bg-primary/10 p-3 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-primary">
                  Why it's a good match:
                </h4>
                <p className="text-sm text-foreground/70">{internship.reason}</p>
              </div>
            </div>
          </CardContent>
        </div>
        <CardFooter className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {internship.skillsRequired.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="capitalize">
                {skill}
              </Badge>
            ))}
            {internship.skillsRequired.length > 3 && (
              <Badge variant="outline">
                +{internship.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
          <Button asChild size="sm">
            <a
              href="https://www.pmkvyofficial.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
