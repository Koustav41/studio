import type { Internship } from '@/lib/types';

export const SECTORS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'social_sector', label: 'Social Sector' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'tourism', label: 'Tourism' },
];

export const INTERNSHIPS: Internship[] = [
  {
    title: 'Digital India Intern',
    description:
      'Contribute to the Digital India mission by working on a project to improve digital literacy in rural areas. Strong communication skills required.',
    sector: 'technology',
    location: 'Various Rural Districts',
    skillsRequired: ['communication', 'project management', 'community outreach'],
  },
  {
    title: 'Ayushman Bharat Health Data Analyst',
    description:
      'Analyze health data from the Ayushman Bharat scheme to identify trends and inform public health policy. Requires knowledge of data analysis tools.',
    sector: 'healthcare',
    location: 'New Delhi',
    skillsRequired: ['data analysis', 'statistics', 'python', 'public health'],
  },
  {
    title: 'Jan Dhan Yojana Financial Inclusion Intern',
    description:
      'Work with a national bank to promote financial literacy and expand the reach of the Jan Dhan Yojana scheme in underserved communities.',
    sector: 'finance',
    location: 'Mumbai',
    skillsRequired: ['finance', 'community work', 'communication'],
  },
  {
    title: 'NEP 2020 Implementation Assistant',
    description:
      'Support the rollout of the National Education Policy 2020 by developing new curriculum frameworks and training materials for teachers.',
    sector: 'education',
    location: 'Bangalore',
    skillsRequired: ['education policy', 'content creation', 'teaching'],
  },
  {
    title: 'Soil Health Card Scheme Field Intern',
    description:
      'Work directly with farmers to collect soil samples, interpret results from the Soil Health Card scheme, and recommend appropriate crop and nutrient management.',
    sector: 'agriculture',
    location: 'Rural Punjab',
    skillsRequired: ['agriculture', 'soil science', 'communication'],
  },
  {
    title: 'Make in India Manufacturing Analyst',
    description:
      'Analyze manufacturing data to identify opportunities for process improvement and support the goals of the Make in India initiative.',
    sector: 'manufacturing',
    location: 'Chennai',
    skillsRequired: ['data analysis', 'industrial engineering', 'process improvement'],
  },
  {
    title: 'Swachh Bharat Mission Coordinator',
    description:
      'Coordinate and monitor sanitation and waste management projects as part of the Swachh Bharat Mission in an urban municipality.',
    sector: 'social_sector',
    location: 'Indore',
    skillsRequired: ['project management', 'social work', 'community outreach'],
  },
  {
    title: 'Smart Cities Mission Urban Planner',
    description:
      'Assist in the planning and design of smart infrastructure projects, including public transit and green spaces, for a designated Smart City.',
    sector: 'infrastructure',
    location: 'Pune',
    skillsRequired: ['urban planning', 'autocad', 'gis'],
  },
  {
    title: 'Handloom Weavers Support Intern',
    description:
      'Work with a textile cooperative to improve market linkages and provide design support for traditional handloom weavers.',
    sector: 'textiles',
    location: 'Varanasi',
    skillsRequired: ['textile design', 'marketing', 'supply chain'],
  },
  {
    title: 'Incredible India Tourism Promoter',
    description:
      'Develop digital marketing campaigns and content to promote tourism for a specific state or cultural heritage site under the Incredible India campaign.',
    sector: 'tourism',
    location: 'Jaipur',
    skillsRequired: ['digital marketing', 'content creation', 'social media'],
  },
];
