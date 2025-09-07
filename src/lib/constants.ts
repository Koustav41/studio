import type { Internship } from '@/lib/types';

export const SECTORS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'social_sector', label: 'Social Sector' },
];

export const INTERNSHIPS: Internship[] = [
  {
    title: 'Frontend Developer Intern',
    description:
      'Work on our main website using React and Next.js. A great opportunity to learn modern web development.',
    sector: 'technology',
    location: 'Bangalore',
    skillsRequired: ['react', 'javascript', 'css', 'html'],
  },
  {
    title: 'Data Science Intern',
    description:
      'Analyze user data to find insights and help improve our product. Requires knowledge of Python and SQL.',
    sector: 'technology',
    location: 'Mumbai',
    skillsRequired: ['python', 'sql', 'data analysis', 'machine learning'],
  },
  {
    title: 'Digital Marketing Intern',
    description:
      'Help manage our social media channels and create engaging content for our audience.',
    sector: 'technology',
    location: 'Delhi',
    skillsRequired: ['social media', 'content creation', 'marketing'],
  },
  {
    title: 'Nursing Assistant',
    description:
      'Assist nurses in a busy hospital environment. Gain hands-on experience in patient care.',
    sector: 'healthcare',
    location: 'Chennai',
    skillsRequired: ['patient care', 'communication'],
  },
  {
    title: 'Medical Research Assistant',
    description:
      'Support a research team in a leading medical institute. A background in biology or chemistry is preferred.',
    sector: 'healthcare',
    location: 'Delhi',
    skillsRequired: ['research', 'biology', 'lab work'],
  },
  {
    title: 'Financial Analyst Intern',
    description:
      'Learn about financial modeling and investment analysis at a leading investment firm.',
    sector: 'finance',
    location: 'Mumbai',
    skillsRequired: ['excel', 'finance', 'analytical skills'],
  },
  {
    title: 'Rural Teaching Fellow',
    description:
      'Teach primary school children in a rural village. A rewarding experience for those passionate about education.',
    sector: 'education',
    location: 'Rural Bihar',
    skillsRequired: ['teaching', 'communication', 'patience'],
  },
  {
    title: 'EdTech Content Creator',
    description: 'Develop educational materials for our online learning platform.',
    sector: 'education',
    location: 'Bangalore',
    skillsRequired: ['content creation', 'teaching', 'video editing'],
  },
  {
    title: 'Agricultural Extension Intern',
    description:
      'Work with farmers to introduce modern farming techniques. Based in a tribal district.',
    sector: 'agriculture',
    location: 'Tribal Jharkhand',
    skillsRequired: ['agriculture', 'communication', 'community work'],
  },
  {
    title: 'Social Work Intern',
    description:
      'Work with an NGO to support underprivileged communities in urban slums.',
    sector: 'social_sector',
    location: 'Urban Slum Mumbai',
    skillsRequired: ['social work', 'empathy', 'communication'],
  },
  {
    title: 'Supply Chain Intern',
    description:
      'Learn the ins and outs of logistics and supply chain management at a large manufacturing plant.',
    sector: 'manufacturing',
    location: 'Pune',
    skillsRequired: ['logistics', 'planning', 'excel'],
  },
  {
    title: 'Community Health Worker',
    description:
      'Promote health and wellness in remote communities. Involves travel to tribal areas.',
    sector: 'social_sector',
    location: 'Tribal Odisha',
    skillsRequired: ['public health', 'communication', 'community outreach'],
  },
];
