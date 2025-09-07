'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/rank-internships.ts';
import '@/ai/flows/translate-text.ts';
