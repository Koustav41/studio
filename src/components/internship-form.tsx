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

const formSchema = z.object({
  education: z.string().min(3, { message: 'Please enter your education level.' }),
  skills: z.string().min(3, { message: 'Please list at least one skill.' }),
  sectorInterest: z.string({
    required_error: 'Please select a sector of interest.',
  }),
  location: z.string().min(2, { message: 'Please enter your preferred city or region.' }),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Level</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 12th Pass, B.A. Graduate" {...field} />
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
              <FormLabel>Your Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., communication, python, patient care"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List your skills, separated by commas.
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
              <FormLabel>Sector of Interest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sector" />
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
              <FormLabel>Preferred Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Delhi, Rural Bihar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Find Internships
        </Button>
      </form>
    </Form>
  );
}
