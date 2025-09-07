'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search } from 'lucide-react';
import { getRecommendedInternships } from '@/app/actions';
import type { RankedInternshipWithDetails } from '@/lib/types';
import { SECTORS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect } from 'react';

const formSchema = z.object({
  education: z
    .string()
    .min(3, { message: 'Please enter your education level.' }),
  skills: z.string().min(3, { message: 'Please list at least one skill.' }),
  sectorInterest: z.string({
    required_error: 'Please select a sector of interest.',
  }),
  location: z
    .string()
    .min(2, { message: 'Please enter your preferred city or region.' }),
});

type InternshipFormProps = {
  onResults: (data: {
    internships?: RankedInternshipWithDetails[];
    error?: string;
  }) => void;
  onLoading: () => void;
  isSubmitting: boolean;
};

export function InternshipForm({
  onResults,
  onLoading,
  isSubmitting,
}: InternshipFormProps) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: '',
      skills: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onLoading();
    const result = await getRecommendedInternships({
      education: values.education,
      skills: values.skills.split(',').map((s) => s.trim()),
      sectorInterests: [values.sectorInterest],
      location: values.location,
    });
    onResults(result);
  }

  const formElements = {
    'form-education-label': 'Education Level',
    'form-education-placeholder': 'e.g., 12th Pass, B.A. Graduate',
    'form-skills-label': 'Your Skills',
    'form-skills-placeholder': 'e.g., communication, python, patient care',
    'form-skills-description': 'List your skills, separated by commas.',
    'form-sector-label': 'Sector of Interest',
    'form-sector-placeholder': 'Select a sector',
    'form-location-label': 'Preferred Location',
    'form-location-placeholder': 'e.g., Delhi, Rural Bihar',
    'form-submit-button': 'Find Internships',
  };

  useEffect(() => {
    Object.entries(formElements).forEach(([key, value]) => {
      t(value, key);
    });
  }, [t]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form-education-label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form-education-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form-skills-label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form-skills-placeholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('form-skills-description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sectorInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form-sector-label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form-sector-placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form-location-label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form-location-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            scale: [1, 1.01, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        >
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {t('form-submit-button')}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
